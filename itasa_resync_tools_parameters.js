//
// ITASA - Resync Tools v3
// by nixxo
//

VSSPlugin = {
  Name : 'ITASA - Resync Tools Parameters',
  Description : 'Modalità Automatica - Resincronizza i sottotitoli ad ogni immissione di un nuovo punto di sincronia.\n'+
                'PrimoSubOK - Se è da considerare il primo punto di sincronia già sincronizzato.\n'+
                'Auto, Colore, Icone, PrimoSubOK -> [0] OFF.  [1] ON.\n'+
                'Log -> [0] OFF.  [1] Min.  [2]Max.',
  Color : 0x0099CC,
  
  ParamAuto : { Value : 1, Unit : '(0/1)', Description : ''},
  ParamLog : { Value : 0, Unit : '(0/1/2)', Description : ''},
  ParamColore : { Value : 1, Unit : '(0/1)', Description : ''},
  ParamIcone : { Value : 1, Unit : '(0/1)', Description : ''},
  ParamPrimoSubOK : { Value : 1, Unit : '(0/1)', Description : ''},

  HasError : function(CurrentSub, PreviousSub, NextSub) {},
  FixError : function(CurrentSub, PreviousSub, NextSub) {}
};