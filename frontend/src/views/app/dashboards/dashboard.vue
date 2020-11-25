<template>
  <div class="main-content">
    <breadcumb :page="'Dashboard'" :folder="'App'" />
    
    <!-- ACTIVE INSPECTIONS GRID -->
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-30 bg-1">
          <div class="card-body p-0">
            <b-row class="row flex justify-content-start">
              <b-col md="auto">
                <h5 class="card-title p-3 pb-0 mb-3 mt-3">Active Inspections</h5>
              </b-col>
              <b-col md="auto">
                <b-button v-if="selectedInspection" class="mt-4" @click="editInspection" size="sm" variant="outline-warning">Edit Inspection</b-button>
              </b-col>
            </b-row>
            <AgGridVue class="ag-theme-material"
                id="gridActiveInspections"
                :defaultColDef="defaultColDef1"
                :columnDefs="columnDefs1"
                :rowSelection="rowSelection"
                :rowData="rowData1"
                :gridOptions="gridOptions1"
                :suppressRowClickSelection="true"
                :excelStyles="excelStyles1"
                @cellValueChanged="updateInspectionGrid"
                @grid-ready="onGridReady1"
                :pagination="true"
                :paginationPageSize="paginationPageSize1"
                :getContextMenuItems="getContextMenu1"
                :domLayout="domLayout"
                :modules="modules">
            </AgGridVue>
            <b-row class="ml-3 mr-3 mt-2 mb-2">
              <b-col md="6" class="text-left">
                <b-button class="mr-3" @click="saveState1" variant="primary">Save Grid State</b-button>
                <b-button @click="restoreState1" variant="light">Reset Grid State</b-button>
              </b-col>
              <b-col md="6" class="text-right">
                Page Size:
                <select @change="onPageSizeChanged1" id="page-size-1">
                    <option value="10" selected="">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                </select>
                <b-button @click="onBtExport1" class="ml-3" size="sm" variant="outline-success">Export Excel</b-button>
              </b-col>
            </b-row>
          </div>
        </div>
      </div>
    </div>
    
    <!-- OPEN ORDERS GRID -->
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-30 bg-2">
          <div class="card-body p-0">
            <h5 class="card-title p-3 pb-0 mb-3 mt-3">Open Orders</h5>
            <AgGridVue class="ag-theme-material"
                id="gridOrders"
                :defaultColDef="defaultColDef"
                :columnDefs="columnDefs"
                :rowSelection="rowSelection"
                :rowData="rowData"
                :gridOptions="gridOptions"
                :suppressRowClickSelection="true"
                :excelStyles="excelStyles"
                @cellValueChanged="updateOrderGrid"
                @grid-ready="onGridReady"
                :pagination="true"
                :paginationPageSize="paginationPageSize"
                :getContextMenuItems="getContextMenu"
                :domLayout="domLayout"
                :modules="modules">
            </AgGridVue>
            <b-row class="ml-3 mr-3 mt-2 mb-2">
              <b-col md="6" class="text-left">
                <b-button class="mr-3" @click="saveState" variant="primary">Save Grid State</b-button>
                <b-button @click="restoreState" variant="light">Reset Grid State</b-button>
              </b-col>
              <b-col md="6" class="text-right">
                Page Size:
                <select @change="onPageSizeChanged" id="page-size">
                    <option value="10" selected="">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                </select>
                <b-button @click="onBtExport" class="ml-3" size="sm" variant="outline-success">Export Excel</b-button>
              </b-col>
            </b-row>
          </div>
        </div>
      </div>
    </div>

    <!-- NEWLY RECORDED DEVICES -->
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-30 bg-3">
          <div class="card-body p-0">
            <h5 class="card-title p-3 pb-0 mb-3 mt-3">New Devices (last 30 days)</h5>
            <AgGridVue class="ag-theme-material"
                id="gridDevices"
                :defaultColDef="defaultColDef2"
                :columnDefs="columnDefs2"
                :rowSelection="rowSelection"
                :rowData="rowData2"
                :gridOptions="gridOptions2"
                :excelStyles="excelStyles2"
                :suppressRowClickSelection="true"
                @grid-ready="onGridReady2"
                :pagination="true"
                :paginationPageSize="paginationPageSize2"
                :getContextMenuItems="getContextMenu2"
                :domLayout="domLayout"
                :modules="modules">
            </AgGridVue>
            <b-row class="ml-3 mr-3 mt-2 mb-2">
              <b-col md="6" class="text-left">
                <b-button class="mr-3" @click="saveState2" variant="primary">Save Grid State</b-button>
                <b-button @click="restoreState2" variant="light">Reset Grid State</b-button>
              </b-col>
              <b-col md="6" class="text-right">
                Page Size:
                <select @change="onPageSizeChanged2" id="page-size-2">
                    <option value="10" selected="">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                </select>
                <b-button @click="onBtExport2" class="ml-3" size="sm" variant="outline-success">Export Excel</b-button>
              </b-col>
            </b-row>
          </div>
        </div>
      </div>
    </div>

    <!-- INSPECTIONS NOT YET CARRIED OUT -->
    <!-- <div class="row">
      <div class="col-md-12">
        <div class="card mb-30 bg-4">
          <div class="card-body p-0">
            <h5 class="card-title p-3 pb-0 mb-0">Inspections not yet carried out</h5>
              <b-row class="mr-3 p-3 pt-0">
                <b-col md="12" class="mt-3">
                  <p style="font-style: italic;">NOT IMPLEMENTED YET</p>
                </b-col>
              </b-row>
          </div>
        </div>
      </div>
    </div> -->

  </div>
</template>
<script>
import { apiService } from "@/common/api.service.js";
import { AgGridVue } from '@ag-grid-community/vue';
import { AllModules } from '@ag-grid-enterprise/all-modules';

export default {
  metaInfo: {
    title: "Dashboard"
  },
  components: {
    AgGridVue
  },
  data() {
    return {
      // AG-GRID VARIABLES "OPEN ORDERS"
      gridOptions: null,
      gridApi: null,
      columnApi: null,
      columnDefs: null,
      rowData: null,
      rowSelection: null,
      defaultColDef: null,
      excelStyles: null,
      frameworkComponents: null,
      domLayout: null,
      modules: AllModules,
      paginationPageSize: null,

      // AG-GRID VARIABLES "ACTIVE INSPECTIONS"
      gridOptions1: null,
      gridApi1: null,
      columnApi1: null,
      columnDefs1: null,
      rowData1: null,
      defaultColDef1: null,
      excelStyles1: null,
      paginationPageSize1: null,
      selectedInspection: false,
      
      // AG-GRID VARIABLES "DEVICES LAST 30 DAYS"
      gridOptions2: null,
      gridApi2: null,
      columnApi2: null,
      columnDefs2: null,
      rowData2: null,
      defaultColDef2: null,
      excelStyles2: null,
      paginationPageSize2: null,
      
      // VUE VARIABLES
      suppliers: [],
      devices: [],
      orders: [],
      inspections: [],
      ONumber: null,
      DatOrder: null,
      DatDelivery: null,
      OType: null,
      CNumber: null,
      DelStatus: null,
      Supplier: null,
      date: null,
      error: false,
      optionSuppliers: [],
      optionInspections: [],
      optionTypes: [
        { value: 'Sample', text: 'Sample' },
        { value: 'Customer', text: 'Customer' },
      ],
      optionStatus: [
        { value: 'Delivered', text: 'Delivered' },
        { value: 'Not Delivered', text: 'Not Delivered' },
      ],
    };
  },
  beforeMount() {
    this.gridOptions = {};
    this.gridOptions1 = {};
    this.gridOptions2 = {};
    this.columnDefs = [
      {headerName: "Order Number", field: "txtOrderNumber", filter: 'agTextColumnFilter', },
      {headerName: "Order Date", field: "datOrder", filter: 'agTextColumnFilter', },
      {headerName: "Delivery Date", field: "datDelivery", filter: 'agTextColumnFilter', },
      {headerName: "Order Type", field: "txtOrderType", filter: 'agTextColumnFilter', },
      {headerName: "Charge Number", field: "txtChargeNumber", filter: 'agTextColumnFilter', },
      {headerName: "Delivery Status", field: "txtDeliveryStatus", filter: 'agTextColumnFilter', editable: true, cellEditor: 'agRichSelectCellEditor', cellEditorParams: { cellHeight: 50, values: ['Delivered', 'Not Delivered']}, },
      {headerName: "Supplier", field: "idSupplier.txtSupplierName", filter: 'agTextColumnFilter', editable: false, },
      {headerName: "Memo", field: "txtComment", filter: 'agTextColumnFilter', editable: false, },
    ],
    this.columnDefs1 = [
      {headerName: "Inspection Number", field: "txtInspectionNumber", filter: 'agTextColumnFilter', },
      {headerName: "Status", field: "txtInspectionStatus", filter: 'agTextColumnFilter', editable: true, cellEditor: 'agRichSelectCellEditor', cellEditorParams: { cellHeight: 50, values: ['Work In Progress', 'On Hold', 'Complete', 'Declined']},},
      {headerName: "Type", field: "txtInspectionType", filter: 'agTextColumnFilter', },
      {headerName: "Inspector", field: "txtInspector", filter: 'agTextColumnFilter',},
      {headerName: "Date", field: "datInspection", filter: 'agTextColumnFilter', },
      {headerName: "Delivered on", field: "datDeliveredOn", filter: 'agTextColumnFilter', },
      {headerName: "Requested on", field: "datRequestedOn", filter: 'agTextColumnFilter', },
      {headerName: "Requested by", field: "txtRequestedBy", filter: 'agTextColumnFilter', },
      {headerName: "Release", field: "txtRelease", filter: 'agTextColumnFilter', },
      {headerName: "Release by", field: "txtReleaseBy", filter: 'agTextColumnFilter', },
      {headerName: "Memo", field: "txtComment", filter: 'agTextColumnFilter', },
    ],
    this.columnDefs2 = [
      {headerName: "Model Name", field: "idModel.txtModelName", filter: 'agTextColumnFilter', editable: false},
      {headerName: "Serial Number", field: "txtSerialNumber", filter: 'agTextColumnFilter',},
      {headerName: "Device Position", field: "txtDevicePosition", filter: 'agTextColumnFilter',},
      {headerName: "Manufacturer", field: "idModel.idManufacturer.txtManufacturerName", filter: 'agTextColumnFilter', editable: false},
      {headerName: "Supplier", field: "idModel.idSupplier.txtSupplierName", filter: 'agTextColumnFilter', editable: false},
    ],
    this.defaultColDef = { editable: false, resizable: true, sortable: true, filter: true, floatingFilter: true, };
    this.defaultColDef1 = { editable: false, resizable: true, sortable: true, filter: true, floatingFilter: true, };
    this.defaultColDef2 = { flex: 1, editable: false, resizable: true, sortable: true, filter: true, floatingFilter: true, };
    this.rowSelection = 'single';
    this.domLayout = 'autoHeight';
    this.paginationPageSize = 10;
    this.paginationPageSize1 = 10;
    this.paginationPageSize2 = 10;
  },
  methods: {
    saveState(params) {
      localStorage.setItem('openOrders_columnStats', JSON.stringify(this.gridOptions.columnApi.getColumnState()));
    },
    saveState1(params) {
      localStorage.setItem('activeInspections_columnStats', JSON.stringify(this.gridOptions1.columnApi.getColumnState()));
    },
    saveState2(params) {
      localStorage.setItem('lastDevices_columnStats', JSON.stringify(this.gridOptions2.columnApi.getColumnState()));
    },
    restoreState() {
      localStorage.setItem('openOrders_columnStats', null);
    },
    restoreState1() {
      localStorage.setItem('activeInspections_columnStats', null);
    },
    restoreState2() {
      localStorage.setItem('lastDevices_columnStats', null);
    },
    // OPEN ORDERS
    onGridReady(params) {
      if(JSON.parse(localStorage.getItem('openOrders_columnStats')) != null) {
        this.gridApi = params.api;
        params.columnApi.setColumnState(JSON.parse(localStorage.getItem('openOrders_columnStats')));
        this.gridApi.setQuickFilter("Not Delivered")
      } else {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi
        this.gridApi.setQuickFilter("Not Delivered")
      }
    },
    // ACTIVE INSPECTIONS
    onGridReady1(params) {
      if(JSON.parse(localStorage.getItem('activeInspections_columnStats')) != null) {
        this.gridApi1 = params.api;
        params.columnApi.setColumnState(JSON.parse(localStorage.getItem('activeInspections_columnStats')));
      } else {
        this.gridApi1 = params.api;
        this.gridColumnApi1 = params.columnApi
      }
    },
    // DEVICES LAST 30 DAYS
    onGridReady2(params) {
      if(JSON.parse(localStorage.getItem('lastDevices_columnStats')) != null || JSON.parse(localStorage.getItem('lastDevices_columnStats')) != undefined) {
        this.gridApi2 = params.api;
        params.columnApi.setColumnState(JSON.parse(localStorage.getItem('lastDevices_columnStats')));
      } else {
        this.gridApi2 = params.api;
        this.gridColumnApi2 = params.columnApi
      }
    },
    onBtExport() {
      this.gridApi.exportDataAsExcel({});
    },
    onBtExport1() {
      this.gridApi1.exportDataAsExcel({});
    },
    onBtExport2() {
      this.gridApi2.exportDataAsExcel({});
    },
    onPageSizeChanged(newPageSize) {
      var value = document.getElementById('page-size').value;
      this.gridApi.paginationSetPageSize(Number(value));
    },
    onPageSizeChanged1(newPageSize) {
      var value = document.getElementById('page-size-1').value;
      this.gridApi1.paginationSetPageSize(Number(value));
    },
    onPageSizeChanged2(newPageSize) {
      var value = document.getElementById('page-size-2').value;
      this.gridApi2.paginationSetPageSize(Number(value));
    },
    editInspectionMenu(params) {
      localStorage.setItem('InspectionID', params.node.data.id)
      this.$router.push('inspection/inspection/')
    },
    editOrderMenu(params) {
      window.localStorage.setItem('selOrder', params.node.data.id)
      this.$router.push('order/order-list')
    },
    editDeviceMenu(params) {
      window.localStorage.setItem('selDevice', params.node.data.id)
      this.$router.push('device/device-list')
    },
    async updateOrderGrid(event) {     
      let endpoint = `/api/order/${event.node.data.id}/`;
      try {
        await apiService(endpoint, "PATCH", { 
          txtOrderNumber: event.node.data.txtOrderNumber,
          datOrder: event.node.data.datOrder,
          datDelivery: event.node.data.datDelivery,
          txtOrderType: event.node.data.txtOrderType,
          txtChargeNumber: event.node.data.txtChargeNumber,
          txtDeliveryStatus: event.node.data.txtDeliveryStatus,
          txtComment: event.node.data.txtComment,
        })
        .catch(err => console.log(err));
      }
      catch (err) {
        console.log(err)
      }
    },
    async updateInspectionGrid(event) {     
      let endpoint = `/api/inspection/${event.node.data.id}/`;
      try {
        await apiService(endpoint, "PATCH", { 
          txtInspectionNumber: event.node.data.txtInspectionNumber,
          txtInspectionStatus: event.node.data.txtInspectionStatus,
          txtInspectionType: event.node.data.txtInspectionType,
          txtInspector: event.node.data.txtInspector,
          datInspection: event.node.data.datInspection,
          datDeliveredOn: event.node.data.datDeliveredOn,
          datRequestedOn: event.node.data.datRequestedOn,
          txtRequestedBy: event.node.data.txtRequestedBy,
          txtLink: event.node.data.txtLink,
          txtComment: event.node.data.txtComment,
        })
        .catch(err => console.log(err));
      }
      catch (err) {
        console.log(err)
      }
    },
    async getUserInfo() {
      // add the username of the logged in user to localStorage
      let endpoint = `/api/user/`;
      let data = await apiService(endpoint);
      let requestUser = data["username"];
      let requestSuperuser = data["is_superuser"]
      window.localStorage.setItem("username", requestUser);
      window.localStorage.setItem("superuser", requestSuperuser);
    },
    getOrder() {
      if (!this.error) {
        this.orders = [];
        let endpoint = `/api/order-list/`;
        apiService(endpoint)
          .then(data => {
            this.orders.push(...data.results);
            this.rowData = this.orders
          })
          .catch(err => console.log(err));
      }
    },
    getSup() {
      if (!this.error) {
        this.suppliers = [];
        let endpoint = `/api/supplier/`;
        apiService(endpoint)
          .then(data => {
            this.suppliers.push(...data.results);
            this.optionSuppliers = this.suppliers
          })
          .catch(err => console.log(err));
      }
    },
    getDevices() {
      if (!this.error) {
        this.devices = [];
        let endpoint = `/api/device-list/`;
        apiService(endpoint)
          .then(data => {
            this.devices.push(...data.results);
            this.rowData2 = this.devices
              .filter(el => {
                let diff = new Date() - new Date(el.datCreated);
                const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
                return (Number(diffDays) <= 30) ? el.datCreated : false;
              })
          })
          .catch(err => console.log(err));
      }
    },
    getInspections() {
      if (!this.error) {
        this.inspections = [];
        let endpoint = `/api/inspection/`;
        apiService(endpoint)
          .then(data => {
            this.inspections.push(...data.results);
            this.rowData1 = this.inspections.filter(el => el.txtInspectionStatus == 'Work In Progress' || el.txtInspectionStatus == 'On Hold')
          })
          .catch(err => console.log(err));
      }
    },
    getContextMenu(params) {
      var result = [
        {
          name: 'Edit Order',
          action: () => this.editOrderMenu(params)
        },
        'separator',
        'export'
      ];
      return result;
    },
    getContextMenu1(params) {
      var result = [
        {
          name: 'Edit Inspection',
          action: () => this.editInspectionMenu(params)
        },
        'separator',
        'export'
      ];
      return result;
    },
    getContextMenu2(params) {
      var result = [
        {
          name: 'Edit Device',
          action: () => this.editDeviceMenu(params)
        },
        'separator',
        'export'
      ];
      return result;
    },
  },
  created() {
    this.getSup();
    this.getOrder();
    this.getDevices();
    this.getInspections();
    this.getUserInfo();
  },
};
</script>

<style>

.bg-1 {
  background-color: rgba(139, 166, 255, 0.5);
}
.bg-2 {
  background-color: rgba(209, 139, 255, 0.5);
}
.bg-3 {
  background-color: rgba(139, 241, 255, 0.5);
}
.bg-4 {
  background-color: rgba(139, 255, 207, 0.5);
}

</style>


