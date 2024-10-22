export default function useUserTableColumns(){

  return [
    {
      name: 'name',
      label: 'User',
      align: 'left',
      field: (row: any) => `${row.first_name} ${row.last_name}`,
      required: true,
      sortable: true
    },
    {name: 'email', align: 'left', label: 'E-mail', field: 'email',  required: true,sortable: true},
    {name: 'league', align: 'left', label: 'League', field: 'league',  required: true,sortable: true},
    {name: 'referee_type', align: 'left', label: 'Referee type', field: 'referee_type', required: true, sortable: true},
    {
      name: 'active',
      label: 'Status',
      field: 'active',
      sortable: true, required: true,
      align: 'left'
    },
    {name: 'details', label: 'Details', field: 'details',  required: true,align: 'center'},
    {name: 'password', label: 'Change password', field: 'password',  required: true,align: 'center'},
    {name: 'delete', label: 'Delete user', field: 'delete',  required: true,align: 'center'}
  ];
}
