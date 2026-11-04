import { getCountries, getCountryCallingCode } from 'libphonenumber-js';

const countryCodes = 'AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' ');
const names = new Intl.DisplayNames(['en'], { type: 'region' });
const callingCodes = new Map(getCountries().map(code => [code as string, `+${getCountryCallingCode(code)}`]));

const europe = new Set('AD AL AT AX BA BE BG BY CH CY CZ DE DK EE ES FI FO FR GB GG GI GR HR HU IE IM IS IT JE LI LT LU LV MC MD ME MF MK MT NL NO PL PT RO RS RU SE SI SJ SK SM UA VA'.split(' '));
const americas = new Set('AI AG AR AW BB BL BM BO BQ BS BZ CA CL CO CR CU CW DM DO EC FK GD GF GL GP GT GU GY HN HT JM KN KY LC MF MQ MS MX NI PA PE PM PR PY RE SR SV SX TC TT UY VC VE VG VI'.split(' '));
const oceania = new Set('AS AU CC CK FJ FM GU HM KI MH MP NC NF NR NU NZ PF PG PN PW SB TK TL TO TV UM VU WF WS'.split(' '));
const pinned = new Map([
  ['US', 0],
  ['DE', 1],
  ['FR', 2],
  ['GB', 3],
  ['ES', 4],
  ['IT', 5],
]);

const priority = (code: string) => {
  const explicit = pinned.get(code);
  if (explicit !== undefined) return explicit;
  if (europe.has(code) || americas.has(code)) return 6;
  if (oceania.has(code)) return 7;
  return 8;
};

export const countries = countryCodes
  .map(code => ({ code, name: names.of(code)!, callingCode: callingCodes.get(code) }))
  .sort((a, b) => priority(a.code) - priority(b.code) || a.name.localeCompare(b.name, 'en'));
