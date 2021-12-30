class BonanzaHangar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {

    //add a delay becuase we need to - to be able to access the simvars - possible sim bug with loading panels
    var delayInMilliseconds = 1000; //1 second


    setTimeout(function() {

      //get the livery
      var title = SimVar.GetSimVarValue("TITLE", "string");
      this.livery = title.replace(/\s+/g, '_');

      //check if state saving is enabled
      this.stateSaving = GetStoredData('G36XIP_STATE_ACTIVE_'+this.livery);

      //get the engine hours
      this.hobbs = GetStoredData('G36XIP_HOBBS_'+this.livery) ? GetStoredData('G36XIP_HOBBS_'+this.livery) : 1.25; //Brand new Aircraft that has had a 45min acceptance flight & 30 minute flight checks prior to ownership

      //get the battery voltages
      this.bat1volts = SimVar.GetSimVarValue('ELECTRICAL BATTERY VOLTAGE:1', "volts");
      this.bat2volts = SimVar.GetSimVarValue('ELECTRICAL BATTERY VOLTAGE:2', "volts");


    //Send info to the panel - eventually put this in a loop

      //if state saving enabled make the checkbox checked
      if (this.stateSaving = 1) {
        console.log('Panel - State Saving Enabled');
        SetStoredData('G36XIP_STATE_ACTIVE_'+this.livery, this.stateSaving.toString());
        document.getElementById("stateSaving").checked = true;
      } else {
        console.log('Panel - State Saving Disabled');
        SetStoredData('G36XIP_STATE_ACTIVE_'+this.livery, this.stateSaving.toString());
        document.getElementById("stateSaving").checked = false;
      }

      //set the engine hours
      document.getElementById("aircraftEngineHours").innerHTML = parseFloat(this.hobbs).toFixed(2);

      //set the battery voltages
      document.getElementById("aircraftBatt1Volts").innerHTML = parseFloat(this.bat1volts).toFixed(2);
      document.getElementById("aircraftBatt2Volts").innerHTML = parseFloat(this.bat2volts).toFixed(2);

      //Set the ATC name etc
      document.getElementById("aircraftReg").innerHTML = SimVar.GetSimVarValue('ATC ID', "string");
      document.getElementById("aircraftLivery").innerHTML = title;

    }, delayInMilliseconds);

    setInterval(function() {

      //get the livery
      var title = SimVar.GetSimVarValue("TITLE", "string");
      this.livery = title.replace(/\s+/g, '_');

      if (GetStoredData('G36XIP_PLUG_FOULING_'+this.livery)) {
        document.getElementById("fouling").innerHTML = "<i class='fa-solid fa-octagon-exclamation fa-lg'></i> Some plugs have experienced fouling, try and lean during ground ops";
      }
    }, 10000);

  }

  //At the moment there is no easy way to delete the stored values and start with a fresh aircraft
  //  @TODO NEED TO COME UP WITH AN EFFECTIVE WAY TO DELETE THE STORED ITEMS WHEN NEEDED, AM CURRENTLY THINKING A CUSTOM TOOL BAR WINDOW
  //  @TODO DO WE NEED TO BE ABLE TO LET THE USER HAVE STATE SAVING OR NOT?
  //To reset the aircraft uncomment the line below
  //var reset = resetState();
  function resetState() {
    DeleteStoredData('G36XIP_LEFT_FUEL_'+this.livery);
    DeleteStoredData('G36XIP_RIGHT_FUEL_'+this.livery);
    DeleteStoredData('G36XIP_PILOT_WEIGHT_'+this.livery);
    DeleteStoredData('G36XIP_COPILOT_WEIGHT_'+this.livery);
    DeleteStoredData('G36XIP_FRONT_LEFT_PAX_WEIGHT_'+this.livery);
    DeleteStoredData('G36XIP_FRONT_RIGHT_PAX_WEIGHT_'+this.livery);
    DeleteStoredData('G36XIP_REAR_LEFT_PAX_WEIGHT_'+this.livery);
    DeleteStoredData('G36XIP_REAR_RIGHT_PAX_WEIGHT_'+this.livery);
    DeleteStoredData('G36XIP_BAGGAGE_WEIGHT_'+this.livery);
    DeleteStoredData('G36XIP_BAT1_'+this.livery);
    DeleteStoredData('G36XIP_BAT2_'+this.livery);
    DeleteStoredData('G36XIP_ALT1_'+this.livery);
    DeleteStoredData('G36XIP_ALT2_'+this.livery);
    DeleteStoredData('G36XIP_PBRAKE_'+this.livery);
    DeleteStoredData('G36XIP_AVIONICS_'+this.livery);
    DeleteStoredData('G36XIP_AIRCO_'+this.livery);
    DeleteStoredData('G36XIP_BLOWER_'+this.livery);
    DeleteStoredData('G36XIP_VENT_BLOWER_'+this.livery);
    DeleteStoredData('G36XIP_AUX_FUEL_PUMP_'+this.livery);
    DeleteStoredData('G36XIP_MAGNETOL_'+this.livery);
    DeleteStoredData('G36XIP_MAGNETOR_'+this.livery);
    DeleteStoredData('G36XIP_PITOT_'+this.livery);
    DeleteStoredData('G36XIP_PROP_DEICE_'+this.livery);
    DeleteStoredData('G36XIP_STROBE_'+this.livery);
    DeleteStoredData('G36XIP_BEACON_'+this.livery);
    DeleteStoredData('G36XIP_NAV_LIGHT_'+this.livery);
    DeleteStoredData('G36XIP_FLOOD_LIGHT_'+this.livery);
    DeleteStoredData('G36XIP_PANEL_LIGHT_'+this.livery);
    DeleteStoredData('G36XIP_TAXI_LIGHT_'+this.livery);
    DeleteStoredData('G36XIP_LANDING_LIGHT_'+this.livery);
    DeleteStoredData('G36XIP_FUEL_SELECT_'+this.livery);
    DeleteStoredData('G36XIP_THROTTLE_'+this.livery);
    DeleteStoredData('G36XIP_PROP_'+this.livery);
    DeleteStoredData('G36XIP_MIXTURE_'+this.livery);
    DeleteStoredData('G36XIP_COWL_'+this.livery);
    DeleteStoredData('G36XIP_FLAPS_SWITCH_'+this.livery);
    DeleteStoredData('G36XIP_FLAPS_LEFT_'+this.livery);
    DeleteStoredData('G36XIP_FLAPS_RIGHT_'+this.livery);
    DeleteStoredData('G36XIP_PITCH_TRIM_'+this.livery);
    DeleteStoredData('G36XIP_AILERON_TRIM_'+this.livery);
    DeleteStoredData('G36XIP_FLOOD_BRIGHTNESS_'+this.livery);
    DeleteStoredData('G36XIP_YOKE_LEFT_'+this.livery);
    DeleteStoredData('G36XIP_YOKE_RIGHT_'+this.livery);
    DeleteStoredData('G36XIP_DEFROST_'+this.livery);
    return true;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }
}
window.customElements.define("bonanza-hangar", BonanzaHangar);
checkAutoload();