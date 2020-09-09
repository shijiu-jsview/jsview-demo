class URL {
    constructor(value, parseTotal) {
        this.href     = '';
        this.origin   = '';
        this.protocol = '';
        this.host     = '';
        this.hostname = '';
        this.port     = '';
        this.pathname = '';
        this.search   = '';
        this.hash     = '';
        if(!value) {
            return;
        }
        if(value.startsWith('url') === true) {
            let startIdx = value.indexOf('(') + 1;
            let endIdx = value.lastIndexOf(')');
            value = value.substring(startIdx, endIdx).trim();
        }

        if(value.startsWith('data:') === true) {
            this.href = value;
            return;
        }
        if(value.startsWith('/') === true) {
            value = document.location.origin + value;
        }
        if (value.startsWith('./') === true) {
            let index = document.location.pathname.lastIndexOf("/");
            let path = "";
            if (index > 0) {
                path = document.location.pathname.substring(0, index);
            }
            value = document.location.origin + path + value.substring(1);
        }

        this.href = value;
        if(!parseTotal) {
            return;
        }

        let idx = this.href.indexOf('?');
        let protocolHostPath = (idx > 0 ? this.href.substring(0, idx) : this.href);
        this.search = (idx > 1 ? this.href.substring(idx) : "");

        idx = protocolHostPath.indexOf('://');
        this.protocol = (idx > 0 ? protocolHostPath.substring(0, idx + 1) : "");
        let hostPath = (idx > 1 ? protocolHostPath.substring(idx + 3) : "");

        idx = hostPath.indexOf('/');
        this.host = (idx > 0 ? hostPath.substring(0, idx) : "");
        this.pathname = (idx > 1 ? hostPath.substring(idx) : "");
        this.origin = (idx > 0 ? this.protocol + "//" + this.host : "");
        // if(!this.origin) {
        //     throw Error("Failed to parse total url.");
        // }

        idx = this.host.indexOf(':');
        this.hostname = (idx > 0 ? this.host.substring(0, idx) : "");
        this.port = (idx > 1 ? this.host.substring(idx + 1) : "");

        console.log("create total parse URL, this=", this);
    }

    replace(newUrl) {
        this.href = newUrl;
    }
}
export default URL;