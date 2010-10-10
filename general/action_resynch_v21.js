// Italian Subs Addicted - Resynch Tools
// by nixxo v2

JSAction_Imposta_Punto_Sincronia = {
  onExecute : function() {
    //legge numero punti di sincronia gia' salvati
    var NumeroPdS = VSSCore.GetPluginParamValue('ResynchTemp', 'NumeroPdS');
    //salva il sottotitolo selezionato
    var PdS = VSSCore.GetFirstSelected();
    
    ScriptLog('N:'+NumeroPdS+' .P:'+PdS.Index);
    
    //Salvo ID del sottotitolo selezionato e shift associato
    VSSCore.SetPluginParamValue('ResynchTemp', 'ID_Pds'+NumeroPdS, PdS.Index);
    VSSCore.SetPluginParamValue('ResynchTemp', 'Shift'+NumeroPdS, VSSCore.GetCursorPosition()-PdS.Start);
    //Incremento il numero di punti di sincronia di uno
    VSSCore.SetPluginParamValue('ResynchTemp', 'NumeroPdS', NumeroPdS+1);
    
    //se sono stati fatti almeno 2 punti di sincronia abilita manu #Procedi
    if (NumeroPdS >= 1) VSSCore.EnableJavascriptItemMenu('Desynch->#Procedi');
    VSSCore.EnableJavascriptItemMenu('Desynch->#Reset');
    Colora_Sub();
  }
};

JSAction_Procedi = {
  onExecute : function() {
    //ciclo lettura punti di sincronia salvati
    var NumeroPdS = VSSCore.GetPluginParamValue('ResynchTemp', 'NumeroPdS');
    var PuntiSincronia = new Array();
    for (var i=0; i<NumeroPdS; i++) {
      PuntiSincronia[i] = new Array();
      PuntiSincronia[i][0] = VSSCore.GetPluginParamValue('ResynchTemp', 'ID_Pds'+i);
      PuntiSincronia[i][1] = VSSCore.GetPluginParamValue('ResynchTemp', 'Shift'+i);
    }
    
    //Ordina Array dei punti di sincronia in base all'ID del sottotitolo
    PuntiSincronia.sort(OrdinaNumeri);
    //e azzera shift del primo punto di sincronia
    PuntiSincronia[0][1] = 0;
    
    //ciclo calcolo shift
    for(var Contatore=0; Contatore < NumeroPdS-1; Contatore++) {
      
      //Inizializza le te variabili necessarie per il resynch
      var Sub_Inizio = VSSCore.GetSubAt(PuntiSincronia[Contatore][0]-1);
      var Sub_Fine = VSSCore.GetSubAt(PuntiSincronia[Contatore+1][0]-1);
      var Shift = PuntiSincronia[Contatore+1][1]-PuntiSincronia[Contatore][1];
      
      var sub = Sub_Inizio;
      var Inizio = Sub_Inizio.Start
      var Fine = Sub_Fine.Index
      var FineI = Sub_Fine.Start;
      var temp_shift;
      
      while (sub != null) {
        //se il sub e' nel range da modificare calcola shift
        if(sub.Index <= Fine) {
          //ScriptLog('ID_Proc: '+sub.Index);
          //ScriptLog(Inizio+':'+FineI+':'+Shift);
          temp_shift = Calcola_Shift(sub.Start, Inizio, FineI, Shift);
          sub.Start = sub.Start + temp_shift;
          //ScriptLog('Shift_start: '+temp_shift);
          temp_shift = Calcola_Shift(sub.Stop, Inizio, FineI, Shift);
          sub.Stop = sub.Stop + temp_shift;
          //ScriptLog('Shift_stop: '+temp_shift);
          //ScriptLog(sub.Index+'::'+Fine);
          //ScriptLog('****');
        }
        //altrimenti aggiunge solo shift
        else {
          sub.Start = sub.Start + Shift;
          sub.Stop = sub.Stop + Shift;
        }
        sub = VSSCore.GetNext(sub);
      }
    }
    
    
    
    ////////////////////////////
    Reset_Menu();
  }
};

JSAction_Reset = {
  onExecute : function() {
    Reset_Menu();
  }
};

function Colora_Sub() {
  var Colori = ["$99CC00", "$FF3232", "$32FFFF"];
  var NumeroPdS = VSSCore.GetPluginParamValue('ResynchTemp', 'NumeroPdS');
  var PuntiSincronia = new Array();
  for (var i=0; i<NumeroPdS; i++) {
    PuntiSincronia[i] = new Array();
    PuntiSincronia[i][0] = VSSCore.GetPluginParamValue('ResynchTemp', 'ID_Pds'+i);
    PuntiSincronia[i][1] = VSSCore.GetPluginParamValue('ResynchTemp', 'Shift'+i);
  }

  PuntiSincronia.sort(OrdinaNumeri);
  //ciclo colora sub
  var Cont_Colori = 0;
  for(var Contatore=0; Contatore < NumeroPdS-1; Contatore++) {
    VSSCore.SetSubColor(PuntiSincronia[Contatore][0], PuntiSincronia[Contatore+1][0], Colori[Cont_Colori++]);
    if (Cont_Colori >= Colori.length) Cont_Colori = 0;
  }
}

function OrdinaNumeri(a,b) {
  return a[0] - b[0];
}

function Reset_Menu() {
  VSSCore.EnableJavascriptItemMenu('Desynch->#PuntoDiSincronia');
  VSSCore.DisableJavascriptItemMenu('Desynch->#Procedi');
  VSSCore.DisableJavascriptItemMenu('Desynch->#Reset');
  //azzera punti di sincronia
  VSSCore.SetPluginParamValue('ResynchTemp', 'NumeroPdS', 0);
  ScriptLog('RESET');
}

function Calcola_Shift(OR,SubI,SubF,SH) {
  var shift = (OR-SubI)*(SH/(SubF-SubI));
  //ScriptLog(shift+'::'+SH);
  //controllo per shift negativo
  if (SH < 0) return shift < SH ? SH : shift;
  return shift < SH ? shift : SH;
}

//Registrazione funzioni javasript
VSSCore.RegisterJavascriptAction('JSAction_Imposta_Punto_Sincronia', 'Desynch->#PuntoDiSincronia', '');
VSSCore.InsertBreakBeforeJavascriptMenuItem('Desynch->#PuntoDiSincronia');
VSSCore.RegisterJavascriptAction('JSAction_Procedi', 'Desynch->#Procedi', '');
VSSCore.RegisterJavascriptAction('JSAction_Reset', 'Desynch->#Reset', '');
VSSCore.InsertBreakAfterJavascriptMenuItem('Desynch->#Reset');
VSSCore.DisableJavascriptItemMenu('Desynch->#Procedi');
VSSCore.DisableJavascriptItemMenu('Desynch->#Reset');
VSSCore.SetPluginParamValue('ResynchTemp', 'NumeroPdS', 0);