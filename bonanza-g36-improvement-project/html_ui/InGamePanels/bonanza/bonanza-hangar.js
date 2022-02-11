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

      //get the battery voltages
      this.bat1volts = SimVar.GetSimVarValue('ELECTRICAL BATTERY VOLTAGE:1', "volts");
      this.bat2volts = SimVar.GetSimVarValue('ELECTRICAL BATTERY VOLTAGE:2', "volts");

      //Send info to the panel - eventually put this in a loop

      //if state saving enabled make the checkbox checked
      if (this.stateSaving == 1) {
        console.log('Panel - State Saving Enabled');
        SetStoredData('G36XIP_STATE_ACTIVE_'+this.livery, this.stateSaving.toString());
      } else {
        console.log('Panel - State Saving Disabled');
        SetStoredData('G36XIP_STATE_ACTIVE_'+this.livery, this.stateSaving.toString());
      }

    }, delayInMilliseconds);

    setInterval(function() {

      var iframe = document.getElementById('iframeId');
      var innerDoc = iframe.contentDocument || iframe.contentWindow.document;

      //get the livery
      var title = SimVar.GetSimVarValue("TITLE", "string");
      this.livery = title.replace(/\s+/g, '_');

      //update the reg in the panel
      var aircraftRegistration = SimVar.GetSimVarValue('ATC ID', "string");
      innerDoc.getElementById("G36XIP_PANEL_ACREG").innerHTML = aircraftRegistration;

      //update the engine hours in the panel
      this.panelHobbs = GetStoredData('G36XIP_HOBBS_'+this.livery);
      innerDoc.getElementById("G36XIP_PANEL_HOBBS").innerHTML = parseFloat(this.panelHobbs).toFixed(1);

      //update the progress bar with days until annual inspection
      var birth = GetStoredData('G36XIP_BIRTHDAY_'+this.livery);
      var birthM = moment(birth).add(1, 'year');
      var todaysdate = moment();
      var annualDaysRemain = birthM.diff(todaysdate, 'days');
      var progress =  100 - (((annualDaysRemain-0) * 100 ) / (365-0))
      innerDoc.querySelector("#annual.progress-bar").style.width = progress + "%";
      var daysRemain = annualDaysRemain;
      var annualText = 'Due in ' + annualDaysRemain + ' days';
      innerDoc.getElementById("G36XIP_PANEL_ANNUAL_DUE").innerHTML = annualText;

      //update the progress bar with hours until 100hr service
      var hundredHourPercentRemain = Number(this.panelHobbs) / 100;
      var hundredHourPercentRemainProgress = hundredHourPercentRemain * 100;
      innerDoc.querySelector("#hundredHour.progress-bar").style.width = hundredHourPercentRemainProgress + "%";
      var hoursRemain = 100 - Number(this.panelHobbs);
      var hundredHourPercentRemainText = 'Due in ' + hoursRemain.toFixed(1) + ' hours';
      innerDoc.getElementById("G36XIP_PANEL_HUNDRED_DUE").innerHTML = hundredHourPercentRemainText;

      //update the distance flown in the panel
      this.distanceFLown = GetStoredData('G36XIP_DISTANCE_FLOWN'+this.livery);
      var distance = nFormatter(Number(this.distanceFLown), 1);
      innerDoc.getElementById("G36XIP_PANEL_DISTANCE_FLOWN").innerHTML = distance;


      //check to see if the state saving status page has loaded
      if (innerDoc.getElementById("htmlState")) {
        var title = SimVar.GetSimVarValue("TITLE", "string");
        this.livery = title.replace(/\s+/g, '_');

        var leftFuel = GetStoredData('G36XIP_LEFT_FUEL_'+this.livery);
        innerDoc.getElementById("stateLeftFuel").innerHTML = leftFuel;
        var rightFuel = GetStoredData('G36XIP_RIGHT_FUEL_'+this.livery);
        innerDoc.getElementById("stateRightFuel").innerHTML = rightFuel;

        var sFLikelihood1 = SimVar.GetSimVarValue("L:G36XIP_SPARK_1_LIKELIHOOD", "number");
        var sFLikelihood3 = SimVar.GetSimVarValue("L:G36XIP_SPARK_3_LIKELIHOOD", "number");
        var sFLikelihood5 = SimVar.GetSimVarValue("L:G36XIP_SPARK_5_LIKELIHOOD", "number");
        var sFLikelihood7 = SimVar.GetSimVarValue("L:G36XIP_SPARK_7_LIKELIHOOD", "number");
        var sFLikelihood9 = SimVar.GetSimVarValue("L:G36XIP_SPARK_9_LIKELIHOOD", "number");
        var sFLikelihood11 = SimVar.GetSimVarValue("L:G36XIP_SPARK_11_LIKELIHOOD", "number");
        innerDoc.getElementById("stateSparkLikelihood").innerHTML = sFLikelihood1.toFixed(2) + ', ' + sFLikelihood3.toFixed(2) + ', ' + sFLikelihood5.toFixed(2) + ', ' + sFLikelihood7.toFixed(2) + ', ' + sFLikelihood9.toFixed(2) + ', ' + sFLikelihood11.toFixed(2);

        var sFActualSwitch1 = SimVar.GetSimVarValue("L:G36XIP_SPARK_1_FOULING", "number");
        var sFActualSwitch3 = SimVar.GetSimVarValue("L:G36XIP_SPARK_3_FOULING", "number");
        var sFActualSwitch5 = SimVar.GetSimVarValue("L:G36XIP_SPARK_5_FOULING", "number");
        var sFActualSwitch7 = SimVar.GetSimVarValue("L:G36XIP_SPARK_7_FOULING", "number");
        var sFActualSwitch9 = SimVar.GetSimVarValue("L:G36XIP_SPARK_9_FOULING", "number");
        var sFActualSwitch11 = SimVar.GetSimVarValue("L:G36XIP_SPARK_11_FOULING", "number");
        var sFActualBadness = SimVar.GetSimVarValue("L:G36XIP_BADNESS_SCALE", "number");
        innerDoc.getElementById("stateSparkFouling").innerHTML = sFActualSwitch1 + ', ' + sFActualSwitch3 + ', ' + sFActualSwitch5 + ', ' + sFActualSwitch7 + ', ' + sFActualSwitch9 + ', ' + sFActualSwitch11 + ' : ' + sFActualBadness.toFixed(4);


        var bat1 = (GetStoredData('G36XIP_BAT1_'+this.livery) == 1) ? 'On' : 'Off';
        innerDoc.getElementById("stateBat1").innerHTML = bat1;
        var bat2 = (GetStoredData('G36XIP_BAT2_'+this.livery) == 1) ? 'On' : 'Off';
        innerDoc.getElementById("stateBat2").innerHTML = bat2;

        var alt1 = (GetStoredData('G36XIP_ALT1_'+this.livery) == 1) ? 'On' : 'Off';
        innerDoc.getElementById("stateAlt1").innerHTML = alt1;
        var alt2 = (GetStoredData('G36XIP_ALT2_'+this.livery) == 1) ? 'On' : 'Off';
        innerDoc.getElementById("stateAlt2").innerHTML = alt2;

        var avionics = (GetStoredData('G36XIP_AVIONICS_'+this.livery) == 1) ? 'On' : 'Off';
        innerDoc.getElementById("stateAvionics").innerHTML = avionics;

        var airco = (GetStoredData('G36XIP_AIRCO_'+this.livery) == 1) ? 'On' : 'Off';
        innerDoc.getElementById("stateAirco").innerHTML = airco;

        var blower = (GetStoredData('G36XIP_BLOWER_'+this.livery) == 1) ? 'On' : 'Off';
        innerDoc.getElementById("stateBlower").innerHTML = blower;

        var ventBlower = (GetStoredData('G36XIP_VENT_BLOWER_'+this.livery) == 1) ? 'On' : 'Off';
        innerDoc.getElementById("stateVentBlower").innerHTML = ventBlower;

        var auxFuel = (GetStoredData('G36XIP_AUX_FUEL_PUMP_'+this.livery) == 1) ? 'On' : 'Off';
        innerDoc.getElementById("stateAuxFuel").innerHTML = auxFuel;

        var leftMag = (GetStoredData('G36XIP_MAGNETO_LEFT_'+this.livery) == 1) ? 'Left Mag' : 'Off';
        var rightMag = (GetStoredData('G36XIP_MAGNETO_RIGHT_'+this.livery) == 1) ? 'Right Mag' : 'Off';
        innerDoc.getElementById("stateMag").innerHTML = leftMag + ' ' + rightMag;

        var pitot = (GetStoredData('G36XIP_PITOT_'+this.livery) == 1) ? 'On' : 'Off';
        innerDoc.getElementById("statePitot").innerHTML = pitot;

        var propIce = (GetStoredData('G36XIP_PROP_DEICE_'+this.livery) == 1) ? 'On' : 'Off';
        innerDoc.getElementById("statePropDeIce").innerHTML = propIce;

        var strobe = (GetStoredData('G36XIP_STROBE_'+this.livery) == 1) ? 'On' : 'Off';
        innerDoc.getElementById("stateStrobe").innerHTML = strobe;

        var beacon = (GetStoredData('G36XIP_BEACON_'+this.livery) == 1) ? 'On' : 'Off';
        innerDoc.getElementById("stateBeacon").innerHTML = beacon;

        var nav = (GetStoredData('G36XIP_NAV_LIGHT_'+this.livery) == 1) ? 'On' : 'Off';
        innerDoc.getElementById("stateNav").innerHTML = nav;

        var flood = (GetStoredData('G36XIP_FLOOD_LIGHT_'+this.livery) == 1) ? 'On' : 'Off';
        innerDoc.getElementById("stateFlood").innerHTML = flood;

        var panel = (GetStoredData('G36XIP_PANEL_LIGHT_'+this.livery) == 1) ? 'On' : 'Off';
        innerDoc.getElementById("statePanel").innerHTML = panel;

        var taxi = (GetStoredData('G36XIP_TAXI_LIGHT_'+this.livery) == 1) ? 'On' : 'Off';
        innerDoc.getElementById("stateTaxi").innerHTML = taxi;

        var landing = (GetStoredData('G36XIP_LANDING_LIGHT_'+this.livery) == 1) ? 'On' : 'Off';
        innerDoc.getElementById("stateLanding").innerHTML = landing;

        var brake = (GetStoredData('G36XIP_PBRAKE_'+this.livery) == 1) ? 'Set' : 'Off';
        innerDoc.getElementById("stateParkBrake").innerHTML = brake;

        switch (GetStoredData('G36XIP_FUEL_SELECT_'+this.livery)) {
          case '0':
            innerDoc.getElementById("stateFuel").innerHTML = 'Off';
            break;
          case '1':
            innerDoc.getElementById("stateFuel").innerHTML = 'Left';
            break;
          case '3':
            innerDoc.getElementById("stateFuel").innerHTML = 'Right';
            break;
        }

        var pitchTrim = (GetStoredData('G36XIP_PITCH_TRIM_'+this.livery)) ? GetStoredData('G36XIP_PITCH_TRIM_'+this.livery) : 'Not saved';
        innerDoc.getElementById("statePitchTrim").innerHTML = pitchTrim;

        var aileronTrim = (GetStoredData('G36XIP_AILERON_TRIM_'+this.livery)) ? GetStoredData('G36XIP_AILERON_TRIM_'+this.livery) : 'Not saved';
        innerDoc.getElementById("stateAileronTrim").innerHTML = aileronTrim;

        var cowlflaps = (GetStoredData('G36XIP_COWL_'+this.livery) >= 0) ? GetStoredData('G36XIP_COWL_'+this.livery) : 'Not saved';
        innerDoc.getElementById("stateCowlFlaps").innerHTML = cowlflaps;


        var throttle = (GetStoredData('G36XIP_THROTTLE_'+this.livery) >= 0) ? GetStoredData('G36XIP_THROTTLE_'+this.livery) : 'Not saved';
        innerDoc.getElementById("stateThrottle").innerHTML = throttle;

        var prop = (GetStoredData('G36XIP_PROP_'+this.livery) >= 0) ?  GetStoredData('G36XIP_PROP_'+this.livery) : 'Not saved';
        innerDoc.getElementById("stateProp").innerHTML = prop;

        var mixture = (GetStoredData('G36XIP_MIXTURE_'+this.livery) >= 0) ? GetStoredData('G36XIP_MIXTURE_'+this.livery) : 'Not saved';
        innerDoc.getElementById("stateMixture").innerHTML = mixture;

        var flaps = (GetStoredData('G36XIP_FLAPS_SWITCH_'+this.livery)) ? GetStoredData('G36XIP_FLAPS_SWITCH_'+this.livery) : 'Not saved';
        innerDoc.getElementById("stateFlaps").innerHTML = flaps;














      }


    }, 5000);

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
    if (document.getElementById('stateSaving').checked) {
      var state = 1;
      SetStoredData('G36XIP_STATE_ACTIVE_'+this.livery, state.toString());
    } else {
      var state = 0;
      SetStoredData('G36XIP_STATE_ACTIVE_'+this.livery, state.toString());
    }
  };

  function nFormatter(num, digits)
  {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function(item) {
      return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }


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
    document.getElementById("resetLabel").innerHTML = "<i class='fa-solid fa-octagon-exclamation fa-lg'></i> Aircraft State Reset";
    document.getElementById("reset").checked = false;
  };