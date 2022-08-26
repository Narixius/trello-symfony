export class Messages {
    static messages: Record<string, string> = {}
    static locale:string;
    static setMessages (messages:any) {
        this.messages = messages;
    }
    static setLocale(locale:string ) {
        if(locale === "en")
            this.locale = ""
        else
            this.locale = "/" + locale
    }
    static trans(key:string){
        if(this.messages && this.messages[key])
            return this.messages[key]
        return key;
    }
}