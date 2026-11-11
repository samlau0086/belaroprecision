#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

release_id=${1:?缺少版本编号}
bind_address=${2:?缺少监听地址}
http_port=${3:?缺少监听端口}
[[ "$release_id" =~ ^[a-f0-9]{40}-[0-9]+-[0-9]+$ ]] || { echo '版本编号无效' >&2; exit 1; }
[[ "$bind_address" == '127.0.0.1' || "$bind_address" == '0.0.0.0' ]] || { echo '监听地址无效' >&2; exit 1; }
[[ "$http_port" =~ ^[1-9][0-9]{0,4}$ ]] && (( http_port <= 65535 )) || { echo '端口无效' >&2; exit 1; }

deploy_root="$HOME/belaroprecision"
archive="$HOME/belaroprecision-$release_id.tar.gz"
release_dir="$deploy_root/releases/$release_id"
command -v flock >/dev/null || { echo '请先安装 util-linux（flock）' >&2; exit 1; }
mkdir -p "$deploy_root/releases"
exec 9>"$deploy_root/deploy.lock"
flock -w 300 9 || { echo '其他部署仍在执行' >&2; exit 1; }
docker info >/dev/null
docker compose version
docker compose up --help | grep -- '--wait-timeout' >/dev/null || { echo '请升级 Docker Compose，需支持 --wait-timeout' >&2; exit 1; }
[[ -f "$archive" ]] || { echo '未找到上传的镜像包' >&2; exit 1; }
[[ ! -e "$release_dir" ]] || { echo '该版本目录已存在，请重新运行工作流生成新编号' >&2; exit 1; }
mkdir "$release_dir"
tar -xzf "$archive" -C "$release_dir" image.tar compose.yaml
docker load --input "$release_dir/image.tar"
image="belaroprecision:$release_id"
docker image inspect "$image" >/dev/null
printf 'BELARO_IMAGE=%s\nHTTP_BIND_ADDRESS=%s\nHTTP_PORT=%s\n' "$image" "$bind_address" "$http_port" > "$release_dir/.env"

compose() {
    local directory=$1
    shift
    docker compose --project-name belaroprecision --env-file "$directory/.env" -f "$directory/compose.yaml" "$@"
}

previous=''
if [[ -L "$deploy_root/current" ]]; then
    previous=$(readlink -f "$deploy_root/current")
    [[ "$previous" == "$deploy_root/releases/"* && -f "$previous/.env" && -f "$previous/compose.yaml" ]] || {
        echo '当前版本记录无效，停止更新' >&2
        exit 1
    }
fi

compose "$release_dir" config --quiet
if ! compose "$release_dir" up -d --wait --wait-timeout 90; then
    echo '新版本未通过健康检查' >&2
    compose "$release_dir" ps || true
    if [[ -n "$previous" ]]; then
        echo '正在恢复上一版本' >&2
        if ! compose "$previous" up -d --wait --wait-timeout 90; then
            echo '自动恢复失败，请登录 VPS 检查容器和端口' >&2
        fi
    else
        echo '首次部署没有上一版本，停止失败容器' >&2
        compose "$release_dir" stop || true
    fi
    exit 1
fi

# 仅在健康检查成功后更新版本记录；保留历史镜像，便于手动回滚。
if [[ -n "$previous" ]]; then
    ln -sfn "$previous" "$deploy_root/previous"
fi
ln -sfn "$release_dir" "$deploy_root/current"
rm -f -- "$archive" "$release_dir/image.tar"
echo "部署成功：$release_id"
