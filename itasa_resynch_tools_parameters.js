//
// ITASA - Resynch Tools v3
// by nixxo
//

VSSPlugin = {
  Name : 'ITASA - Resynch Tools Parameters',
  Description : 'PrimoSubOK - Se è da considerare il primo punto di sincronia già sincronizzato.\n'+
                'AutoReset - Se viene impostato un PdS esterno al range dei primi due resetta.\n'+
                'AutoReset, Colore, Icone, PrimoSubOK -> [0] OFF.  [1] ON.\n'+
                'Log -> [0] OFF.  [1] Min.  [2]Max.',
  Color : 0x0099CC,
  
  ParamAutoReset : { Value : 0, Unit : '(0/1)', Description : ''},
  ParamLog : { Value : 0, Unit : '(0/1/2)', Description : ''},
  ParamColore : { Value : 1, Unit : '(0/1)', Description : ''},
  ParamIcone : { Value : 1, Unit : '(0/1)', Description : ''},
  ParamPrimoSubOK : { Value : 1, Unit : '(0/1)', Description : ''},

  HasError : function(CurrentSub, PreviousSub, NextSub) {},
  FixError : function(CurrentSub, PreviousSub, NextSub) {}
};