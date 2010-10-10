// Italian Subs Addicted - Prova Resynch
// by nixxo v1.1

/*Imposta inizio resynch*/
JSAction_Imposta_Inizio = {
  onExecute : function() {
    //salva posizione primo sub
    try { VSSCore.SetPluginParamValue('ResynchTemp', 'ID_Inizio',VSSCore.GetFirstSelected().Index);}
    catch (err) { ScriptLog('Selezionare Sub Inizio');}
    /* Da provare per primo sub non in synch
    try { VSSCore.SetPluginParamValue('ResynchTemp', 'Shift_Inizio',VSSCore.GetGursorPosition());}
    catch (err) { ScriptLog('Selezionare Cursore');}
    */
    VSSCore.DisableJavascriptItemMenu('#Inizio');
    VSSCore.EnableJavascriptItemMenu('#Fine');
  }
};

JSAction_Imposta_Fine = {
  onExecute : function() {
    //salva posizione ultimo sub
    var Sub_Inizio, Sub_Fine, Shift_Inizio, Shift_Fine;
    try { Sub_Fine = VSSCore.GetFirstSelected();} catch(err) { ScriptLog('Selezionare Sub Fine');}
    
    //salva ultimo shift
    Shift = VSSCore.GetCursorPosition()-Sub_Fine.Start;
    
    Sub_Inizio = VSSCore.GetSubAt(VSSCore.GetPluginParamValue('ResynchTemp', 'ID_Inizio')-1);
    //Da provare per primo sub non in synch
    //Shift_Inizio = VSSCore.GetPluginParamValue('ResynchTemp', 'Shift_Inizio')-Sub_Inizio.Start;
    
    ScriptLog('Inizio: '+Sub_Inizio.Index);
    ScriptLog('Fine: '+Sub_Fine.Index);
    //ScriptLog('Shift_I[ms]: '+Shift_Inizio);
    ScriptLog('Shift_F[ms]: '+Shift);
    
    //ScriptLog('-----------------');
    //inizializzazione variabili
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
    ScriptLog('-----------------');
    VSSCore.DisableJavascriptItemMenu('#Fine');
    VSSCore.EnableJavascriptItemMenu('#Inizio');
  }
};

function Calcola_Shift(OR,SubI,SubF,SH) {
  var shift = (OR-SubI)*(SH/(SubF-SubI));
  //ScriptLog(shift+'::'+SH);
  //controllo per shift negativo
  if (SH < 0) return shift < SH ? SH : shift;
  return shift < SH ? shift : SH;
}

//Registrazione funzioni javasript
VSSCore.RegisterJavascriptAction('JSAction_Imposta_Inizio', '#Inizio', '');
VSSCore.RegisterJavascriptAction('JSAction_Imposta_Fine', '#Fine', '');
VSSCore.DisableJavascriptItemMenu('#Fine');