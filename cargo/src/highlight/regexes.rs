lazy_static! {
    pub static ref DRUGS_RE: String = format!(r"(?i)({})", drugs_re_parts().join("|")).to_string();
    pub static ref GOV_RE: String = r"(?i)путин|навальн".to_string().replace("\n", "");
}

fn drugs_re_parts() -> Vec<&'static str> {
    vec![
        r"(\b([сc](?:ол|мес)(?:[ьи]|ей)|заклад(?:к[аи]|чик|к[ао](?:ми|й))|[sc]pices?|[сc]пайс(?:[ыи]|ов)?))",
        r"(\b(каапи|банистериопсис|[ck]aapi|banisteriopsis))",
        r"(\b(диплоптерис|кабрерана|diplopterys|cabrerana))",
        r"(\b(ибога|tabernanthe|iboga))",
        r"(\b(психотрия|psychotria))",
        r"(\b(псилоц[иы]бин|псилоц[иы]н))",
        r"(\b(геры[4ч]\w?|маков\w{1,2}[\W_]{0,5}соломк\w{1,2}|кан{1,2}абис\w?|can{1,2}abis))",
        r"(\b(коноп(?:л\w|пельк\w)|мар(и|е)\s?хуан{1,2}\w|анаш\w(?:чк\w)?|гаши[шк]\w?|г[ао]нд?ж(?:а|убас)))",
        r"(\b(кокаин|опи(?:[яй]|ум|ат)|кан{1,2}абиноид))",
        r"(\b(гер[оа]ин))",
    ]
}