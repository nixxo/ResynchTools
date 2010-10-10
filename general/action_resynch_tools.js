//
// ITASA - Resynch Tools v3
// by nixxo
//
//ChangeLog ;-)
//v3.0  : versione iniziale
//
//v3.1  : fix controllo minimum blank (non fa il controllo quando i sub si sovrappongono)
//
//v3.1.1: aggiunto controllo VSSCore.GetSubCount() all'impostazione del PdS [segnalato da red5]
//        corretto errore 'ReferenceError: Resynch is not defined' [segnalato da marylena]
//
//v3.2  : tolto comando #Procedi e relative impostazioni
//        aggiunto parametro AutoReset e relativi controlli [richiesto da red5]
//        aggiunto controllo icona per ultimo punto di sincronia
//        corretto Resync in Resynch [segnalato da marylena]
//        modificato comando #Reset
//v3.2.1: corretto refuso v3.1 in descrizione plugin [segnalato da marylena]
//        

LoadScript("../common/itasa_resynch_tools.js");

JSAction_Imposta_PdS = {
  onExecute : function() {
    if ( VSSCore.GetSubCount() != 0 ) {
      Imposta_Punto( VSSCore.GetFirstSelected(), false );
      
      Resynch();
      
      if ( PuntiDiSincronia() > 0 ) VSSCore.EnableJavascriptItemMenu( 'Resynch->#Cancella PdS' );
      if ( PuntiDiSincronia() > 0 ) VSSCore.EnableJavascriptItemMenu( 'Resynch->#Reset' );
    }
  }
};
  
JSAction_Cancella_PdS = {
  onExecute : function() {
    Imposta_Punto( VSSCore.GetFirstSelected(), true );
    
    if ( PuntiDiSincronia() < 1 ) VSSCore.DisableJavascriptItemMenu( 'Resynch->#Cancella PdS' );
    if ( PuntiDiSincronia() < 1 ) VSSCore.DisableJavascriptItemMenu( 'Resynch->#Reset' );    

  }
};

JSAction_Reset_v3 = {
  onExecute : function() {
    Reset();
    VSSCore.EnableJavascriptItemMenu( 'Resynch->#PuntoDiSincronia' );
    VSSCore.DisableJavascriptItemMenu( 'Resynch->#Cancella PdS' );
    VSSCore.DisableJavascriptItemMenu( 'Resynch->#Reset' );
  }
};

//Registrazione funzioni javasript
VSSCore.RegisterJavascriptAction( 'JSAction_Imposta_PdS', 'Resynch->#PuntoDiSincronia', '' );
VSSCore.RegisterJavascriptAction( 'JSAction_Cancella_PdS', 'Resynch->#Cancella PdS', '' );
VSSCore.RegisterJavascriptAction( 'JSAction_Reset_v3', 'Resynch->#Reset', '' );

//Inserimento menu break
VSSCore.InsertBreakBeforeJavascriptMenuItem( 'Resynch->#PuntoDiSincronia' );
VSSCore.InsertBreakAfterJavascriptMenuItem( 'Resynch->#Reset' );

//Disabilito vosi del munu non utilizzabili
VSSCore.DisableJavascriptItemMenu( 'Resynch->#Cancella PdS' );
VSSCore.DisableJavascriptItemMenu( 'Resynch->#Reset' );
