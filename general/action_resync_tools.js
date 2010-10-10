//
// ITASA - Resync Tools v3
// by nixxo
//

LoadScript("../common/itasa_resync_tools.js");

JSAction_Imposta_PdS = {
  onExecute : function() {
    if ( VSSCore.GetSubCount() !=0 ) {
      Imposta_Punto( VSSCore.GetFirstSelected(), false );
      
      if ( isAuto() ) Resync();
      
      if ( PuntiDiSincronia() > 0 ) VSSCore.EnableJavascriptItemMenu('Resync->#Cancella PdS');
      if ( PuntiDiSincronia() > 0 ) VSSCore.EnableJavascriptItemMenu('Resync->#Reset');    
      if ( PuntiDiSincronia() > 1 && !isAuto() ) VSSCore.EnableJavascriptItemMenu('Resync->#Procedi');
    }
  }
};
  
JSAction_Cancella_PdS = {
  onExecute : function() {
    Imposta_Punto( VSSCore.GetFirstSelected(), true );
    
    if ( PuntiDiSincronia() < 1 ) VSSCore.DisableJavascriptItemMenu('Resync->#Cancella PdS');
    if ( PuntiDiSincronia() < 1 ) VSSCore.DisableJavascriptItemMenu('Resync->#Reset');    
    if ( PuntiDiSincronia() < 2 && !isAuto() ) VSSCore.DisableJavascriptItemMenu('Resync->#Procedi');

  }
};

JSAction_Reset_v3 = {
  onExecute : function() {
    Reset();
    Reset_Menu_v3();
  }
};

JSAction_Procedi_v3 = {
  onExecute : function() {
    Resync();
    Reset();
    Reset_Menu_v3();
  }
};

function Reset_Menu_v3() {
  VSSCore.EnableJavascriptItemMenu('Resync->#PuntoDiSincronia');
  VSSCore.DisableJavascriptItemMenu('Resync->#Cancella PdS');
  VSSCore.DisableJavascriptItemMenu('Resync->#Procedi');
  VSSCore.DisableJavascriptItemMenu('Resync->#Reset');
}

//Registrazione funzioni javasript
VSSCore.RegisterJavascriptAction('JSAction_Imposta_PdS',  'Resync->#PuntoDiSincronia', '');
VSSCore.RegisterJavascriptAction('JSAction_Cancella_PdS', 'Resync->#Cancella PdS',     '');
VSSCore.RegisterJavascriptAction('JSAction_Procedi_v3',   'Resync->#Procedi',          '');
VSSCore.RegisterJavascriptAction('JSAction_Reset_v3',     'Resync->#Reset',            '');

//Inserimento menu break
VSSCore.InsertBreakBeforeJavascriptMenuItem('Resync->#PuntoDiSincronia');
VSSCore.InsertBreakAfterJavascriptMenuItem('Resync->#Reset');

//Disabilito vosi del munu non utilizzabili
VSSCore.DisableJavascriptItemMenu('Resync->#Cancella PdS');
VSSCore.DisableJavascriptItemMenu('Resync->#Procedi');
VSSCore.DisableJavascriptItemMenu('Resync->#Reset');
