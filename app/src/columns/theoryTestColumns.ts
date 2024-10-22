export default function useTheoryTestColumns(){

  return [

    {name: 'name', align: 'left', label: 'Test', field: 'name',  required: true,sortable: true},
    {name: 'league', align: 'left', label: 'League', field: 'league',  required: true,sortable: true},
    {name: 'details', label: 'Test details', field: 'details',  required: true,align: 'center'},
    {name: 'results', label: 'Results', field: 'results',  required: true,align: 'center'},
    {name: 'delete', label: 'Delete test', field: 'delete',  required: true,align: 'center'}
  ];
}
