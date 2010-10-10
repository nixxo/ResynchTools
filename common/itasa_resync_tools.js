//
// ITASA - Resync Tools v3
// by nixxo
//

//
// Funzione di clonazione degli oggetti
// by Brian Huisman - http://my.opera.com/GreyWyvern/blog/show.dml/1725165
// 
Object.prototype.clone = function() {
  var newObj = ( this instanceof Array ) ? [] : {};
  for ( i in this ) {
    if ( i == 'clone' ) continue;
    if ( this[i] && typeof this[i] == "object" ) {
      newObj[i] = this[i].clone();
    } else newObj[i] = this[i]
  } return newObj;
};

//Definire i colori utilizzati
var Colori = ["$99CC00", "$FF3232", "$32FFFF"];

//Variabili utilizzate per tener traccia dei punti di sincronia
var PuntiSincronia = new Array();

//Variabili per la lettura dei parametri del plugin
var Log = 1, Auto = 1, Col = 1, Ico = 1, PrOK = 1;

//FUNZIONE da aggiungere controlli
function Imposta_Punto( ssub, del ) {
  var trovato = false;
  //clono l'oggetto ssub per evitare che nell'array siano presenti riferimenti
  //all'oggeto e che in seguito possano sballare i punti di sincronia
  var sub = ssub.clone();
  var i = 0;
  //ciclo che scorre l'array dei punti di sincronia per cercare
  //se è già impostato un punto sullo stesso sottotitolo
  while( i < PuntiSincronia.length && !trovato ) {
    //Se è presente un punto di sincronia sullo stesso sottotitolo
    if ( PuntiSincronia[i][0] == sub.Index ) {
      //Aggiorno lo shift assegnato a quel sottotitolo
      //se non è un punto da cancellare
      if ( !del ) PuntiSincronia[i][1] = VSSCore.GetCursorPosition();

      //Se è un punto da cancellare tolgo l'icona e cancello il punto di sincronia
      if (del) VSSCore.SetSubIcon( PuntiSincronia[i][0], 0 );
      if (del) PuntiSincronia.splice(i,1);

      trovato = true;
    }
    i++;
  }
  //Se non esiste un punto di sincronia su quel sottotitolo lo aggiungo
  if ( !trovato ) {
    var NumeroPdS = PuntiSincronia.length;
    PuntiSincronia[NumeroPdS] = new Array();
    PuntiSincronia[NumeroPdS][0] = sub.Index;
    PuntiSincronia[NumeroPdS][1] = VSSCore.GetCursorPosition();    
    if ( NumeroPdS == 0 && isPrimoOK() ) PuntiSincronia[NumeroPdS][1] = sub.Start;
    if ( log(2) ) ScriptLog('Aggiunto nuovo punto di sincronia: '+PuntiSincronia[NumeroPdS][0]);
    if ( isIcone() ) VSSCore.SetSubIcon( PuntiSincronia[NumeroPdS][0], 1 );
    if ( isIcone() && NumeroPdS == 0 ) VSSCore.SetSubIcon( PuntiSincronia[NumeroPdS][0], 4 );
  }
  
  //Mantiene ordinato array dei punti di sincronia
  PuntiSincronia.sort( OrdinaNumeri );
  
  if ( isColore() ) Colora_Sub();
  
  if ( log(1) ) Stampa_Array();

}

//Funzione che scorrei sottotitoli e applica ad ognuno lo shift
//in base a dove si trovano rispetto ai punti di sincronia stabiliti
function Resync() {
    
  if ( log(1) ) ScriptLog('Calcolando...');
  
  var Contatore = 0;
  var Sub_Inizio= null, Shift_Inizio = null, Sub_Fine = null, Shift_Fine = null, sub = null;

  do {
    //Imposta il range di sottotitoli da analizzare
    Sub_Inizio = VSSCore.GetSubAt( PuntiSincronia[Contatore][0] - 1 ).clone();
    Shift_Inizio = PuntiSincronia[Contatore][1] - Sub_Inizio.Start;
    if ( log(2) ) ScriptLog('SuI: '+Sub_Inizio.Index+' St: '+Sub_Inizio.Start+' Sh: '+Shift_Inizio);
    try {
      Sub_Fine = VSSCore.GetSubAt( PuntiSincronia[Contatore+1][0] - 1 ).clone();
      Shift_Fine = PuntiSincronia[Contatore+1][1] - Sub_Fine.Start;
      if ( log(2) ) ScriptLog('SuF: '+Sub_Fine.Index+' St: '+Sub_Fine.Start+' Sh: '+Shift_Fine);
    } catch ( err ) { if ( log(2) ) ScriptLog('SuF: null'); }
    //Fine impostazione range
    
    //sub e' la variabile che tiene traccia del sottotitolo attaulmente analizzato e scorre
    //tra i due range fino a Sub_Fine
    sub = VSSCore.GetSubAt( Sub_Inizio.Index - 1 );
    
    if ( log(2) ) ScriptLog('Sub: '+sub.Index);
    if ( log(2) ) ScriptLog('----------------');      
    var exit = false;
    
    //Entra nel ciclo di modifica dello shift solo se c'è uno shift da applicare
    //altrimenti salta e passa al prossimo range
    if ( Shift_Inizio != 0 || Shift_Fine != 0 ) {
      //ciclo che scorre i sottotitoli entro il range definito precedentemente
      while ( sub != null && !exit ) {
        //se non c'è impostato un range si applica ai sottotitoli il semplice shift
        if ( Sub_Fine == null ) {
          //Appplica shift Inizio
          if ( Shift_Inizio != 0 ) {
            if ( log(2) ) ScriptLog('@Sub Prima o dopo senza fine: '+sub.Index+' SH:'+Shift_Inizio);
            sub.Start += Shift_Inizio;
            sub.Stop += Shift_Inizio;
          }
          if ( sub.Index == Sub_Inizio.Index ) {
            //Controllo Minumum Blank
            try {
              var subP = VSSCore.GetPrevious( sub );
              //Controlla il minimum Blank solo per i sottotitoli che si avvicinano troppo
              //e non per quelli che si sovrappongono perchè la sovrapposizione, se presente,
              //non è causata dallo script ma già presente nei sottotitoli ed evidentemente necessaria.
              if ( sub.Start - subP.Stop < VSSCore.MinimumBlank && sub.Start > subP.Stop )
                subP.Stop = sub.Start - VSSCore.MinimumBlank;
            } catch ( err ) {}              
          }
        }
        //se invece e' impostato un range calcola lo shift
        else {
          //richiama la funzione che calcola lo shift lineare tra due punti e lo applica allo Start del sottotiolo
          var temp_shift = Calcola_Shift( sub.Start, Sub_Inizio.Start , Sub_Fine.Start, Shift_Inizio, Shift_Fine );
          if ( log(2) ) ScriptLog('@prog shift: '+sub.Index+':'+temp_shift);
          sub.Start += temp_shift;
          //e fà lo stesso con lo Stop del sottotitolo
          temp_shift = Calcola_Shift( sub.Stop, Sub_Inizio.Start, Sub_Fine.Start, Shift_Inizio, Shift_Fine );
          sub.Stop += temp_shift;
           
          //controllo Minumum Blank
          try {
            var subP = VSSCore.GetPrevious( sub );
            if ( sub.Start - subP.Stop < VSSCore.MinimumBlank && sub.Start >= subP.Stop )
              subP.Stop = sub.Start - VSSCore.MinimumBlank;
          } catch ( err ) {}
          
          if ( log(2) ) ScriptLog('#'+sub.Index+':'+Sub_Fine.Index);
          //se il sottotiolo analizzato e' quello prima della fine del range esco dal ciclo
          if ( sub.Index == Sub_Fine.Index-1 ) exit = true;
        }
        
        if ( log(2) ) ScriptLog('Sub: '+sub.Index);
        sub = VSSCore.GetNext( sub );
      }
    }

    Sub_Inizio = Sub_Fine = Shift_Inizio = Shift_Fine = null;
    Contatore++;
  }while (sub != null)
    
  if ( log(1) ) ScriptLog('Fatto.');
}

//FUNZIONE OK
function Reset() {
  VSSCore.ResetSubColor();
  // Cacella icone sui punti di sincronia
  for ( var i=0; i < PuntiSincronia.length; i++ )
    VSSCore.SetSubIcon( PuntiSincronia[i][0], 0 );
  //Imposta icona sull'ultimo punto
  VSSCore.SetSubIcon( PuntiSincronia.pop()[0], 5 );
  //svuota array dei punti di sincronia
  PuntiSincronia.splice( 0, PuntiSincronia.length );
  
  if ( log(1) ) Stampa_Array();
}
  
//FUNZIONE OK
function Colora_Sub() {
  var Cont_Colori = 0;
  VSSCore.ResetSubColor();
  for(var Contatore=0; Contatore < PuntiSincronia.length-1; Contatore++) {
    VSSCore.SetSubColor(PuntiSincronia[Contatore][0], PuntiSincronia[Contatore+1][0], Colori[Cont_Colori++]);
    if (Cont_Colori >= Colori.length) Cont_Colori = 0;
  }
}

//Funzione accessoria alla funzione .sort() degli array
//necessaria all'ordinamento crescente rispetto all'indice 0
function OrdinaNumeri(a,b) {
  return a[0] - b[0];
}

//Funzione che calcola lo shift da applicare ad un punto rispetto a due estremi
//OR = punto originale a cui applicare lo shift
//SubI, SubF = Estremi su cui calcolare lo shift
//ShI, ShF = Shift iniziale o shift finale
function Calcola_Shift(OR, SubI, SubF, ShI, ShF) {
  if ( ShI == 0 ) {
    var shift = (OR-SubI)*(ShF/(SubF-SubI));
    //controllo per shift negativo
    if (ShF < 0) return shift < ShF ? ShF : Math.round(shift);
    return shift < ShF ? Math.round(shift) : ShF;
  }
  var shift = (SubF-OR)*(ShI/(SubF-SubI));
  //controllo per shift negativo
  if (ShI < 0) return shift < ShI ? ShI : Math.round(shift);
  return shift < ShI ? Math.round(shift) : ShI;
}

//Stampa su console elenco dei punti di sincronia
function Stampa_Array() {
  ScriptLog('----------------');
  for (var i=0; i < PuntiSincronia.length; i++)
    ScriptLog(PuntiSincronia[i][0]+' | '+PuntiSincronia[i][1]);
  ScriptLog('----------------');
}

//Ritorna il numero dei punti di sincronia
function PuntiDiSincronia() {
  return PuntiSincronia.length;
}


//Funzioni che ritornano i valori delli dai parametri del plugin
function isAuto() {
  try { Auto = VSSCore.GetPluginParamValue('ITASA - Resync Tools Parameters', 'ParamAuto'); } catch (err) {}
  return Auto == 1 ? true : false;
}

function isColore() {
  try { Col = VSSCore.GetPluginParamValue('ITASA - Resync Tools Parameters', 'ParamColore'); } catch (err) {}
  return Col == 1 ? true : false;
}

function isIcone() {
  try { Ico = VSSCore.GetPluginParamValue('ITASA - Resync Tools Parameters', 'ParamIcone'); } catch (err) {}
  return Ico == 1 ? true : false;
}

function log( level ) {
  try { Log = VSSCore.GetPluginParamValue('ITASA - Resync Tools Parameters', 'ParamLog'); } catch (err) {}
  return Log == level ? true : false;
}

function isPrimoOK() {
  try { PrOK = VSSCore.GetPluginParamValue('ITASA - Resync Tools Parameters', 'ParamPrimoSubOK'); } catch (err) {}
  return PrOK == 1 ? true : false;
}
