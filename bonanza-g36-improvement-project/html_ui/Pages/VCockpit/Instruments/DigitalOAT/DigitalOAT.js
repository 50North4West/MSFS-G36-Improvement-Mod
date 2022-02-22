class DigitalOAT extends BaseInstrument {
    constructor() {
        super();
		SimVar.SetSimVarValue("L:G36XIP_TEMP_SELECT", "number", 0); // 	SET DEFAULT TO 0
        this.isFarenheit = true;
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
                this.isFarenheit = !this.isFarenheit;
            }
        }
    }
    Update() {
        super.Update();
        if (this.isElectricityAvailable()) {
            if (SimVar.GetSimVarValue("L:G36XIP_TEMP_SELECT", "number") == 1) {
                diffAndSetText(this.textElem, this.getATMTemperatureF());
            }
            else {
                diffAndSetText(this.textElem, this.getATMTemperatureC());
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