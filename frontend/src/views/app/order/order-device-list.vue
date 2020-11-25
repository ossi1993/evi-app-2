<template>
  <!-- ============ Body content start ============= -->
  <div class="main-content">
    <breadcumb :page="'List Order Devices'" :folder="'Order'" />
    <b-row>
      <!-- ICON BG -->
      <b-col lg="6" md="6" sm="12">
        <b-card class="card-icon-bg card-icon-bg-primary o-hidden mb-30 text-center" >
          <i class="i-Add-Cart"></i>
          <div class="content">
            <p class="text-muted mt-2 mb-0">Orders</p>
            <p class="inline text-primary text-24 line-height-1 mb-2">{{ this.orders.length }}</p>
          </div>
        </b-card>
      </b-col>
      <b-col lg="6" md="6" sm="12">
        <b-card class="card-icon-bg card-icon-bg-primary o-hidden mb-30 text-center" >
          <i class="i-Calendar"></i>
          <div class="content">
            <p class="text-muted mt-2 mb-0">Date</p>
            <p class="text-primary text-24 line-height-1 mb-2"><nobr>{{ this.date }}</nobr></p>
          </div>
        </b-card>
      </b-col>
    </b-row>

    <!-- ########################################### -->
    <!-- ########### ORDER DEVICE SECTION ########## -->
    <!-- ########################################### -->
    <div class="row" v-if="updateDeviceStatus">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0 mb-3">
            <b-row class="ml-3">
              <i class="nav-icon i-Add mt-3" style="font-size: 20px"></i>
              <h5 class="card-title border-bottom p-3 mb-2">Update Device Order</h5>
            </b-row>
            <div class="mt-3" v-show="show">
              <b-form @submit.prevent="updateDeviceOrder">
                <!-- ORDER INPUT -->
                <b-row class="mt-4 ml-3 mr-3">
                  <b-col md="4">
                    <v-select v-model="orderedDevice" :options="devices" required placeholder="Choose Device"
                      :get-option-label="label => label.idModel.txtModelName + ' - ' + label.txtSerialNumber"></v-select>
                  </b-col>
                  <b-col md="4">
                    <b-form-datepicker v-model="DatOrder" placeholder="Order Date" required disabled></b-form-datepicker >
                  </b-col>
                  <b-col md="4">
                    <b-form-datepicker v-model="DatDelivery" placeholder="Delivery Date" ></b-form-datepicker >
                  </b-col>
                </b-row>
                <b-row class="mt-3 ml-3 mr-3">
                  <b-col md="6">
                    <b-form-input v-model="OrderAmount" type="number" min=1 required></b-form-input>
                  </b-col>
                  <b-col md="6">
                    <b-form-select v-model="DelStatus" :options="optionStatus" text-field="label" value-field="code"></b-form-select>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="12">
                    <b-form-textarea v-model="Comment" placeholder="Enter memo ..." rows="3" max-rows="6"></b-form-textarea>
                  </b-col>
                </b-row>
                <!-- UPDATE DEVICE BUTTONS -->
                <b-row class="ml-3 mr-3 mt-5">
                  <b-col md="6">
                    <b-button @click="emptyDeviceInput" block variant="outline-info">Cancel</b-button>
                  </b-col>
                  <b-col md="6">
                    <b-button block variant="warning" type="submit">Update Device Order</b-button>
                  </b-col>
                </b-row>
              </b-form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AG-GRID DEVICES -->
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0">
            <AgGridVue class="ag-theme-alpine"
                id="gridOrders"
                :defaultColDef="defaultColDef"
                :columnDefs="columnDefs"
                :rowSelection="rowSelection"
                :rowData="rowData"
                :gridOptions="gridOptions"
                :suppressRowClickSelection="true"
                :excelStyles="excelStyles"
                @cellValueChanged="updateDeviceOrderGrid"
                @row-selected="onRowSelected"
                :getContextMenuItems="getContextMenu"
                :pagination="true"
                :paginationPageSize="paginationPageSize"
                :domLayout="domLayout"
                :modules="modules"
                :animateRows="true"
                :isExternalFilterPresent="isExternalFilterPresent"
                :doesExternalFilterPass="doesExternalFilterPass" >
            </AgGridVue>
            <!-- GRID BUTTONS -->
            <b-row>
              <b-col md="6">
                <div class="ml-3 fmr-3 mt-2 mb-2 text-left">
                  <b-button @click="changeExternalFilter('all')" size="sm" variant="outline-info">Show All</b-button>
                  <b-button @click="changeExternalFilter('delivered')" class="ml-3" size="sm" variant="outline-info">Show Delivered</b-button>
                  <b-button @click="changeExternalFilter('not delivered')" class="ml-3" size="sm" variant="outline-info">Show Not Delivered</b-button>
                </div>
              </b-col>
              <b-col md="6">
                <div class="ml-3 mr-3 mt-2 mb-2 text-right">
                    Page Size:
                    <select @change="onPageSizeChanged" id="page-size">
                        <option value="10" selected="">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="200">200</option>
                    </select>
                    <b-button @click="onBtExport" class="ml-3" size="sm" variant="outline-success">Export Excel</b-button>
                </div>
              </b-col>
            </b-row>
          </div>
        </div>
      </div>
    </div>
    <!-- AG-GRID STATE -->
    <b-row class="ml-1 mr-3 mb-4">
      <b-button class="mr-3" @click="saveState" variant="primary">Save Grid State</b-button>
      <b-button @click="restoreState" variant="outline-light">Reset Grid State</b-button>
    </b-row>
  </div>
  <!-- ============ Body content End ============= -->
</template>
<script>
import { apiService } from "@/common/api.service.js";
import { AgGridVue } from '@ag-grid-community/vue';
import { AllModules } from '@ag-grid-enterprise/all-modules';

export default {
  metaInfo: {    
    title: "Device Orders"
  },
  components: {
    AgGridVue
  },
  data() {
    return {
      // AG-GRID VARIABLES
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

      // VUE VARIABLES
      orders: [],
      devices: [],
      orderedDevice: [],
      DatOrder: null,
      DatDelivery: null,
      OrderAmount: null,
      DelStatus: null,
      Comment: null,
      show: false,
      date: null,
      next: null,
      error: false,
      updateDeviceId: null,
      updateDeviceStatus: false,
      optionStatus: [
        { code: null, label: 'Choose Delivery Status' },
        { code: 'Delivered', label: 'Delivered' },
        { code: 'Not Delivered', label: 'Not Delivered' },
      ],
    };
  },
  beforeMount() {
    this.gridOptions = {};
    this.columnDefs = [
      {headerName: "Order Number", field: "idOrder.txtOrderNumber", filter: 'agTextColumnFilter', editable: false,},
      {headerName: "Serial Number", field: "idDevice.txtSerialNumber", filter: 'agTextColumnFilter', },
      {headerName: "IMEI", field: "idDevice.txtIMEI", filter: 'agTextColumnFilter', },
      {headerName: "Device", field: "idDevice.idModel.txtModelName", filter: 'agTextColumnFilter', editable: false,},
      {headerName: "Order Amount", field: "numOrderAmount", filter: 'agTextColumnFilter',},
      {headerName: "Order Date", field: "datOrder", filter: 'agTextColumnFilter',},
      {headerName: "Delivery Date", field: "datDelivery", filter: 'agTextColumnFilter',} ,
      {headerName: "Delivery Status", field: "txtDeliveryStatus", filter: 'agTextColumnFilter', editable: false,},
      {headerName: "Memo", field: "txtComment", filter: 'agTextColumnFilter', },
    ],
    this.defaultColDef = { flex: 1, editable: true, resizable: true, sortable: true, filter: true, floatingFilter: true, };
    this.rowSelection = 'single';
    this.domLayout = 'autoHeight';
    this.paginationPageSize = 10;
  },
  mounted() {
    if (JSON.parse(localStorage.getItem('orderDevice_columnStats')) != null) {
       this.gridOptions.columnApi.setColumnState(JSON.parse(localStorage.getItem('orderDevice_columnStats')));
    } else {
      this.gridApi = this.gridOptions.api;
      this.gridColumnApi = this.gridOptions.columnApi;
    }
  },
  methods: {
    saveState() {
      localStorage.setItem('orderDevice_columnStats', JSON.stringify(this.gridOptions.columnApi.getColumnState()));
    },
    restoreState() {
      localStorage.setItem('orderDevice_columnStats', null);
    },
    onBtExport() {
      this.gridApi.exportDataAsExcel({});
    },
    onPageSizeChanged(newPageSize) {
      var value = document.getElementById('page-size').value;
      this.gridApi.paginationSetPageSize(Number(value));
    },
    onRowSelected(event) {
      this.show1 = this.show1 ? false : true
    },
    changeExternalFilter(val) {
      this.extFilter = val;
      this.gridApi.onFilterChanged();
    },
    isExternalFilterPresent() {
      return this.extFilter !== null;
    },
    doesExternalFilterPass(node) {
      switch (this.extFilter) {
        case 'all':
          return true;
        case 'delivered':
          return node.data.txtDeliveryStatus === 'Delivered';
        case 'not delivered':
          return node.data.txtDeliveryStatus === 'Not Delivered';
        default:
          return true;
      }
    },
    editOrderDeviceMenu(params) {
      this.emptyDeviceInput();
      let sel = params.node.data;
      this.orderedDevice = sel.idDevice;
      this.DatOrder = sel.datOrder;
      this.DatDelivery = sel.datDelivery;
      this.OrderAmount = sel.numOrderAmount;
      this.DelStatus = sel.txtDeliveryStatus;
      this.Comment = sel.txtComment;
      this.updateDeviceStatus = true;
      this.updateDeviceId = sel.id;
      this.show = true;
      document.documentElement.scrollTop = 0;
    },
    async updateDeviceOrder() {
      let endpoint = `/api/order-device/${this.updateDeviceId}/`;
      await apiService(endpoint, "PATCH", {
        datOrder: this.DatOrder,
        datDelivery: this.DatDelivery,
        numOrderAmount: this.OrderAmount,
        txtDeliveryStatus: this.DelStatus,
        txtComment: this.Comment, 
        idDevice: this.orderedDevice.id })
          .then(response => {
            this.getDeviceOrder();
            this.emptyDeviceInput();
          })
    },
    async updateDeviceOrderGrid(event) {     
      let endpoint = `/api/order-device/${event.node.data.id}/`;
      try {
        await apiService(endpoint, "PATCH", {
          datOrder: event.node.data.datOrder,
          datDelivery: event.node.data.datDelivery,
          numOrderAmount: event.node.data.numOrderAmount,
          txtDeliveryStatus: event.node.data.txtDeliveryStatus,
        })
        .catch(err => console.log(err));
      }
      catch (err) { console.log(err) }
    },
    openModal(params) {
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to delete the selected Order? => " + params.node.data.idDevice.txtSerialNumber, {
          title: "Please Confirm",
          size: "m",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "YES",
          cancelTitle: "NO",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true
        })
        .then(value => { if (value) { this.deleteDeviceOrder(params); } })
        .catch(err => console.log(err));
    },
    async deleteDeviceOrder(params) {
      let endpoint = `/api/order-device/${params.node.data.id}/`;
      await apiService(endpoint, "DELETE")
        .then(response => {
          if (response != 'ERROR') {
            this.getDeviceOrder();
          } else {
            this.$bvToast.toast(`You can't delete this instance. Please check if all connections to this instance are deleted.`, {
              title: 'DELETE WARNING', variant: 'danger', autoHideDelay: 6000, appendToast: false
            })
          }
        })
    },
    emptyDeviceInput(event) {
      this.DatOrder = this.DatDelivery = this.OrderAmount = this.DelStatus = this.Comment = null;
      this.orderedDevice = [];
      this.show = !this.show;
      this.updateDeviceStatus = false;
    },
    getDevice() {
      if (!this.error) {
        this.devices = [];
        let endpoint = `/api/device-list/`;
        apiService(endpoint)
          .then(data => {
            this.devices.push(...data.results);
          })
          .catch(err => console.log(err));
      }
    },
    getDeviceOrder() {
      if (!this.error) {
        this.orders = [];
        let endpoint = `/api/order-device-list/`;
        apiService(endpoint)
          .then(data => {
            this.orders.push(...data.results);
            this.rowData = this.orders
          })
          .catch(err => console.log(err));
      }
    },
    getDateToday() {
      var today = new Date();
      this.date = today.getDate()+' / '+(today.getMonth()+1)+' / '+today.getFullYear();
    },
    getContextMenu(params) {
      var result = [
        {
          name: 'Edit Order Device',
          action: () => this.editOrderDeviceMenu(params)
        },
        'separator',
        {
          name: 'Delete Device Order',
          action: () =>  this.openModal(params)
        },
        'export'
      ];
      return result;
    },
  },
  created() {
    this.getDeviceOrder();
    this.getDateToday();
    this.getDevice();
  },
};
</script>
<style>
  i:focus,
  input:focus,
  select:focus,
  textarea:focus,
  button:focus {
      outline: none;
  }
</style>
