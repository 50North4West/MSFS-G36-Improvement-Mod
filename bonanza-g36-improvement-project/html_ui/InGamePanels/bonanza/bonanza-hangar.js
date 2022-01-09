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
      console.log('Panel - SetTimeout running');

      //check if state saving is enabled
      this.stateSaving = GetStoredData('G36XIP_STATE_ACTIVE_'+this.livery);

      //if state saving enabled make the checkbox checked
      if (this.stateSaving == 1) {
        console.log('Panel - State Saving Enabled');
        SetStoredData('G36XIP_STATE_ACTIVE_'+this.livery, this.stateSaving.toString());
        document.getElementById("stateSaving").checked = true;
        console.log('Panel - Changed savestate. 1');
      } else {
        console.log('Panel - State Saving Disabled');
        SetStoredData('G36XIP_STATE_ACTIVE_'+this.livery, this.stateSaving.toString());
        document.getElementById("stateSaving").checked = false;
        console.log('Panel - Changed savestate. 0 ');
      }

      //get the engine hobbs hours
	  var hobbshours = SimVar.GetSimVarValue('L:G36XIP_HOBBS_START', "number");
      this.panelHobbs = hobbshours; //Brand new Aircraft that has had a 45min acceptance flight & 30 minute flight checks prior to ownership

    //Send info to the panel - eventually put this in a loop

      //set the engine hours
      document.getElementById("aircraftEngineHours").innerHTML = parseFloat(this.panelHobbs).toFixed(2);

      //set the aircraftHoursToService
      document.getElementById("aircraftHoursToService").innerHTML = parseFloat(100.0 - ((hobbshours) % 100.0)).toFixed(2);
	  
	  //get TTSN
	  var ttsnhours = parseFloat(GetStoredData('G36XIP_TTSN_'+this.livery));
	  this.panelTTSN = ttsnhours > 0.0 ? ttsnhours : 1.5;
	  if(ttsnhours < hobbshours) {
		ttsnhours = hobbshours;
	  }
	  //set TTSN
      document.getElementById("aircraftHoursTTSN").innerHTML = parseFloat((ttsnhours)).toFixed(2);
	  
      //Set the ATC name etc
      document.getElementById("aircraftReg").innerHTML = SimVar.GetSimVarValue('ATC ID', "string");
      document.getElementById("aircraftLivery").innerHTML = title;

      //get the battery voltages
      this.bat1volts = SimVar.GetSimVarValue('ELECTRICAL BATTERY VOLTAGE:1', "volts");
      //set the battery voltages
      document.getElementById("aircraftBatt1Volts").innerHTML = parseFloat(this.bat1volts).toFixed(2);
      this.bat1volts = SimVar.GetSimVarValue('ELECTRICAL BATTERY VOLTAGE:2', "volts");
      //set the battery voltages
      document.getElementById("aircraftBatt2Volts").innerHTML = parseFloat(this.bat1volts).toFixed(2);

    }, delayInMilliseconds);

    setInterval(function() {

      //get the livery
      var title = SimVar.GetSimVarValue("TITLE", "string");
      this.livery = title.replace(/\s+/g, '_');
      console.log('Panel - SetInterval running');

      if (SimVar.GetSimVarValue('L:G36XIP_SPARK_1_FOULING', "number") == 1) {
        document.getElementById("fouling1").innerHTML = "<i class='fa-solid fa-octagon-exclamation fa-lg'></i> Plugs 1 & 2 are experiencing fouling<br>";
      }

      if (SimVar.GetSimVarValue('L:G36XIP_SPARK_3_FOULING', "number") == 1) {
        document.getElementById("fouling3").innerHTML = "<i class='fa-solid fa-octagon-exclamation fa-lg'></i> Plugs 3 & 4 are experiencing fouling<br>";
      }

      if (SimVar.GetSimVarValue('L:G36XIP_SPARK_5_FOULING', "number") == 1) {
        document.getElementById("fouling5").innerHTML = "<i class='fa-solid fa-octagon-exclamation fa-lg'></i> Plugs 5 & 6 are experiencing fouling<br>";
      }

      if (SimVar.GetSimVarValue('L:G36XIP_SPARK_7_FOULING', "number") == 1) {
        document.getElementById("fouling7").innerHTML = "<i class='fa-solid fa-octagon-exclamation fa-lg'></i> Plugs 7 & 8 are experiencing fouling<br>";
      }

      if (SimVar.GetSimVarValue('L:G36XIP_SPARK_9_FOULING', "number") == 1) {
        document.getElementById("fouling9").innerHTML = "<i class='fa-solid fa-octagon-exclamation fa-lg'></i> Plugs 9 & 10 are experiencing fouling<br>";
      }

      if (SimVar.GetSimVarValue('L:G36XIP_SPARK_11_FOULING', "number") == 1) {
        document.getElementById("fouling11").innerHTML = "<i class='fa-solid fa-octagon-exclamation fa-lg'></i> Plugs 11 & 12 are experiencing fouling<br>";
      }



    }, 10000);

  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }
}
window.customElements.define("bonanza-hangar", BonanzaHangar);
checkAutoload();

function stateChange()
{
  var title = SimVar.GetSimVarValue("TITLE", "string");
  this.livery = title.replace(/\s+/g, '_');
  console.log('Panel - Trigger Change state');
  if (document.getElementById('stateSaving').checked) {
    this.stateSaving = 1;
    SetStoredData('G36XIP_STATE_ACTIVE_'+this.livery, this.stateSaving.toString());
    SimVar.SetSimVarValue('L:G36XIP_STATESAVING', "number", this.stateSaving);
    console.log('Panel - Trigger Change state - 1');
  } else {
    this.stateSaving = 0;
    SetStoredData('G36XIP_STATE_ACTIVE_'+this.livery, this.stateSaving.toString());
    SimVar.SetSimVarValue('L:G36XIP_STATESAVING', "number", this.stateSaving);
    console.log('Panel - Trigger Change state - 0');
  }
};

function resetState()
{
  var title = SimVar.GetSimVarValue("TITLE", "string");
  this.livery = title.replace(/\s+/g, '_');
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
  DeleteStoredData('G36XIP_DEFROST_'+this.livery);
  DeleteStoredData('G36XIP_SPARK_1_FOULING_'+this.livery);
  DeleteStoredData('G36XIP_SPARK_3_FOULING_'+this.livery);
  DeleteStoredData('G36XIP_SPARK_5_FOULING_'+this.livery);
  DeleteStoredData('G36XIP_SPARK_7_FOULING_'+this.livery);
  DeleteStoredData('G36XIP_SPARK_9_FOULING_'+this.livery);
  DeleteStoredData('G36XIP_SPARK_11_FOULING_'+this.livery);
  document.getElementById("resetLabel").innerHTML = "<i class='fa-solid fa-octagon-exclamation fa-lg'></i> Aircraft State Reset";
  document.getElementById("reset").checked = false;
};