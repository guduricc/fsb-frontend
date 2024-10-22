export default function useAvailabilityTableColumns(){

  return [
    {
      name: 'name',
      label: 'User',
      align: 'left',
      field: (row: any) => `${row.first_name} ${row.last_name}`,
      required: true,
      sortable: true
    },
    {name: 'league', align: 'left', label: 'League', field: 'league',  required: true,sortable: true},
    {name: 'date', align: 'left', label: 'Date', field: 'date', required: true, sortable: true},
    {name: 'time', align: 'left', label: 'Time', field: 'time', required: true, sortable: true},
    {name: 'reason', align: 'left', label: 'Reason', field: 'reason', required: true, sortable: true},
  ];
}
