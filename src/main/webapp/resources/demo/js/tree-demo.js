var TreeDemo = {
  
    localData: [
            {
                label: 'Documents',
                data: 'Documents Folder',
                children: [{
                        label: 'Work',
                        data: 'Work Folder',
                        children: [{label: 'Expenses.doc', iconType: 'doc', data: 'Expenses Document'}, {label: 'Resume.doc', iconType: 'doc', data: 'Resume Document'}]
                    },
                    {
                        label: 'Home',
                        data: 'Home Folder',
                        children: [{label: 'Invoices.txt', iconType: 'doc', data: 'Invoices for this month'}]
                    }]
            },
            {
                label: 'Pictures',
                data: 'Pictures Folder',
                children: [
                    {label: 'barcelona.jpg', iconType: 'picture', data: 'Barcelona Photo'},
                    {label: 'logo.jpg', iconType: 'picture', data: 'PrimeFaces Logo'},
                    {label: 'primeui.png', iconType: 'picture', data: 'PrimeUI Logo'}]
            },
            {
                label: 'Movies',
                data: 'Movies Folder',
                children: [{
                        label: 'Al Pacino',
                        data: 'Pacino Movies',
                        children: [{label: 'Scarface', iconType: 'video', data: 'Scarface Movie'}, {label: 'Serpico', iconType: 'video', data: 'Serpico Movie'}]
                    },
                    {
                        label: 'Robert De Niro',
                        data: 'De Niro Movies',
                        children: [{label: 'Goodfellas', iconType: 'video', data: 'Goodfellas Movie'}, {label: 'Untouchables', iconType: 'video', data: 'Untouchables Movie'}]
                    }]
            }
        ],
        
        remoteData: function(ui, response) {
            $.ajax({
                type: "GET",
                url: 'rest/tree/all',
                dataType: "json",
                context: this,
                success: function(data) {
                    response.call(this, data);
                }
            });
        },
        
        treetableData: [
            {
                data: {name: 'Documents', size: '75kb', type: 'Folder'},
                children: [
                    {
                        data: {name: 'Work', size: '55kb', type: 'Folder'},
                        children: [
                            {
                                data: {name: 'Expenses.doc', size: '30kb', type: 'Document'}
                            },
                            {
                                data: {name: 'Resume.doc', size: '25kb', type: 'Resume'}
                            }
                        ]
                    },
                    {
                        data: {name: 'Home', size: '20kb', type: 'Folder'},
                        children: [
                            {
                                data: {name: 'Invoices', size: '20kb', type: 'Text'}
                            }
                        ]
                    }
                ]
            },
            {
                data: {name: 'Pictures', size: '150kb', type: 'Folder'},
                children: [
                    {
                        data: {name: 'barcelona.jpg', size: '90kb', type: 'Picture'}
                    },
                    {
                        data: {name: 'primeui.png', size: '30kb', type: 'Picture'}
                    },
                    {
                        data: {name: 'optimus.jpg', size: '30kb', type: 'Picture'}
                    }
                ]
            }
        ]
};