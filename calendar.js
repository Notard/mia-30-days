export const totalDays=s=>s.duration===30?30:7;
export const moneyLimit=s=>totalDays(s)===30?999:200;
