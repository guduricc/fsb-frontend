export default function useUserAvailabilityTableColumns(){

  return [
    {name: 'date', align: 'left', label: 'Date', field: 'period',  required: true,sortable: true},
    {name: 'time', align: 'left', label: 'Time', field: 'period',  required: true,sortable: true},
    {name: 'reason', label: 'Reason', field: 'reason',  required: true, align: 'left'},
    // {name: 'update', label: 'Promena', field: 'edit',  required: true,align: 'center'},
    {name: 'delete', label: 'Delete', field: 'delete',  required: true,align: 'center'}
  ];
}
