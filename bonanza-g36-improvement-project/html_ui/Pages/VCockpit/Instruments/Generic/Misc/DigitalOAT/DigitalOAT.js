class DigitalOAT extends BaseInstrument {
    constructor() {
        super();
        this.isCelcius = true;
    }
    get templateID() { return "DigitalOAT"; }
    connectedCallback() {
        super.connectedCallback();
        this.textElem = this.getChildById("textZone");
    }
    disconnectedCallback() {
        super.disconnectedCallback();
    }
    onInteractionEvent(_args) {
        if (this.isElectricityAvailable()) {
            if (_args[0] == "oclock_select") {
                this.isCelcius = !this.isCelcius;
            }
        }
    }
    Update() {
        super.Update();
        if (this.isElectricityAvailable()) {
            if (this.isCelcius) {

                diffAndSetText(this.textElem, this.getATMTemperatureC());

            }
            else {
                diffAndSetText(this.textElem, this.getATMTemperatureF());

            }
        }
    }
    getATMTemperatureC() {
        var value = SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "celsius");
        if (value) {
            var degrees = Number.parseInt(value);
            var temperature = degrees + '' + "C";
            return temperature + '';
        }
        return "";
    }
    getATMTemperatureF() {
        var value = SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "farenheit");
        if (value) {
            var degrees = Number.parseInt(value);
            var temperature = degrees + '' + "F";
            return temperature + '';
        }
        return "";
    }
}
registerInstrument("digital-oat-element", DigitalOAT);
//# sourceMappingURL=DigitalOAT.js.map