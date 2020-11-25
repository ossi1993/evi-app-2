<template>
  <!-- ============ Body content start ============= -->
  <div class="main-content">
    <breadcumb :page="'Device Attributes'" :folder="'Device'" />
    <b-row>
      <!-- ICON BG -->
      <b-col lg="6" md="6" sm="12">
        <b-card
          class="card-icon-bg card-icon-bg-primary o-hidden mb-30 text-center"
        >
          <i class="i-Atom"></i>
          <div class="content">
            <p class="text-muted mt-2 mb-0">Attributes</p>
            <p class="inline text-primary text-24 line-height-1 mb-2">{{ this.attributes.length }}</p>
          </div>
        </b-card>
      </b-col>
      <b-col lg="6" md="6" sm="12">
        <b-card
          class="card-icon-bg card-icon-bg-primary o-hidden mb-30 text-center"
        >
          <i class="i-Calendar"></i>
          <div class="content">
            <p class="text-muted mt-2 mb-0">Date</p>
            <p class="text-primary text-24 line-height-1 mb-2"><nobr>{{ this.date }}</nobr></p>
          </div>
        </b-card>
      </b-col>
    </b-row>
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0 mb-3">
            <b-row class="ml-3">
              <i class="nav-icon i-Add mt-3" style="font-size: 20px" @click="show = !show"></i>
              <h5 class="card-title border-bottom p-3 mb-2">New Device Attribute</h5>
            </b-row>
            <div class="mt-3" v-show="show">
              <b-form>
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="4">
                    <b-form-input id="input-1" v-model="KeyAtt" type="text" required placeholder="Key Attribute" ></b-form-input>
                  </b-col>
                  <b-col md="4">
                    <b-form-input id="input-2" v-model="NameAtt" type="text" required placeholder="Name Attribute" ></b-form-input>
                  </b-col>
                  <b-col md="4">
                    <b-form-input id="input-3" v-model="ValueAtt" type="text" required placeholder="Value Attribute" ></b-form-input>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="4">
                    <v-select  id="select-1" v-model="ValueType" :options="optionsTypes" required placeholder="Choose Type" 
                    label="text" :reduce="Type => Type.value"></v-select>
                  </b-col>
                  <b-col md="4">
                    <v-select  id="select-2" v-model="Parameter" :options="optionsUnits" required placeholder="Choose Parameter" 
                    label="text" :reduce="Unit => Unit.value"></v-select>
                  </b-col>
                  <b-col md="4">
                    <v-select  id="select-3" v-model="Device" :options="optionsDevices" required placeholder="Choose Device" 
                    label="txtSerialNumber" :reduce="Device => Device.id"></v-select>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="6">
                    <b-button @click="emptyInput" block variant="outline-danger">Delete Input</b-button>
                  </b-col>
                  <b-col md="6">
                    <b-button @click="addAtt" block variant="success">Add Attribute</b-button>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3">
                  <b-col md="12" class="mt-3">
                    <b-alert v-if="error" show variant="alert alert-card alert-danger" dismissible>
                      <strong class="text-capitalize">Error!</strong> The Input is not valid.
                    </b-alert>
                  </b-col>
                </b-row>
              </b-form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0">
            <AgGridVue class="ag-theme-alpine"
                id="gridAttributes"
                :defaultColDef="defaultColDef"
                :columnDefs="columnDefs"
                :rowSelection="rowSelection"
                :rowData="rowData"
                :gridOptions="gridOptions"
                :suppressRowClickSelection="true"
                @grid-ready="onGridReady"
                @cellValueChanged="updateAttributeGrid"
                @row-selected="onRowSelected"
                :masterDetail="true"
                :detailCellRendererParams="detailCellRendererParams"
                :pagination="true"
                :paginationPageSize="paginationPageSize"
                :domLayout="domLayout"
                :modules="modules">
            </AgGridVue>
            <div class="ml-3 mr-3 mt-2 mb-2 text-right">
                Page Size:
                <select @change="onPageSizeChanged" id="page-size">
                    <option value="10" selected="">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                </select>
                <b-button @click="onBtnExport" class="ml-3" size="sm" variant="outline-success">Export Excel</b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    title: "Device Attributes"
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
      columnDefsMod: null,
      rowData: null,
      rowDataMod: null,
      rowSelection: null,
      defaultColDef: null,
      frameworkComponents: null,
      detailCellRendererParams: null,
      domLayout: null,
      modules: AllModules,
      // VUE VARIABLES
      attributes: [],
      devices: [],
      show: false,
      visible: false,
      KeyAtt: null,
      NameAtt: null,
      ValueAtt: null,
      ValueType: null,
      Parameter: null,
      Device: null,
      date: null,
      next: null,
      error: false,
      optionsDevices: [],
      optionsTypes: [
        { value: 'INTEGER', text: 'Number' },
        { value: 'FLOAT', text: 'Decimal' },
        { value: 'STRING', text: 'Text' },
        { value: 'BOOLEAN', text: 'True/False' },
      ],
      optionsUnits: [
        { value: 'mm', text: 'Millimetre' },
        { value: 'cm', text: 'Centimetre' },
        { value: 'mg', text: 'Milligram' },
        { value: 'g', text: 'Gram' },
        { value: 'ml', text: 'Millilitre' },
        { value: 'in', text: 'Inch' },
        { value: 'oz', text: 'Ounce' },
      ],
    };
  },
  beforeMount() {
    this.gridOptions = {};
    this.columnDefs = [
      {headerName: "Key Attribute", field: "txtKeyAttribute", filter: 'agTextColumnFilter', checkboxSelection: true,},
      {headerName: "Name Attribute", field: "txtNameAttribute", filter: 'agTextColumnFilter', },
      {headerName: "Value Attribute", field: "txtValueAttribute", filter: 'agTextColumnFilter', },
      {headerName: "Value Type", field: "txtValueType", filter: 'agTextColumnFilter', },
      {headerName: "Parameter", field: "txtParameter", filter: 'agTextColumnFilter', },
      {headerName: "Device", field: "idDevice", filter: 'agTextColumnFilter', editable: false},
    ],
    this.defaultColDef = { editable: true, resizable: true, sortable: true, filter: true, floatingFilter: true, };
    this.rowSelection = 'single';
    this.domLayout = 'autoHeight';
    this.paginationPageSize = 10;
  },
  mounted() {
    if (window.DeviceAttributeColState)
       this.gridOptions.columnApi.setColumnState(window.DeviceAttributeColState);
    else
      this.gridApi = this.gridOptions.api;
      this.gridColumnApi = this.gridOptions.columnApi;
  },
  methods: {
    saveState() {
      window.DeviceAttributeColState = this.gridOptions.columnApi.getColumnState();
    },
    restoreState() {
      window.DeviceAttributeColState = null;
    },
    onBtnExport() {
      this.gridApi.exportDataAsExcel({});
    },
    onPageSizeChanged(newPageSize) {
      var value = document.getElementById('page-size').value;
      this.gridApi.paginationSetPageSize(Number(value));
    },
    autoSizeAll(skipHeader) {
      var allColumnIds = [];
      this.gridColumnApi.getAllColumns().forEach(function(column) {
        allColumnIds.push(column.colId);
      });
      this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
    },
    async updateAttributeGrid(event) {     
      let endpoint = `/api/device-attribute/${event.node.data.id}/`;
      try {
        await apiService(endpoint, "PATCH", { 
          txtKeyAttribute: event.node.data.txtKeyAttribute,
          txtNameAttribute: event.node.data.txtNameAttribute,
          txtValueAttribute: event.node.data.txtValueAttribute,
          txtValueType: event.node.data.txtValueType,
          txtParameter: event.node.data.txtParameter,
          idDevice: event.node.data.idDevice,
        })
      }
      catch (err) {
        console.log(err)
      }
    },
    onRowSelected(event) {
      this.show = this.show ? false : true
    },
    onGridReady(params) { 
    },
    getAtt() {
      if (!this.error) {
        this.attributes = [];
        let endpoint = `/api/device-attribute/`;
        apiService(endpoint)
          .then(data => {
            this.attributes.push(...data.results);
            this.rowData = this.attributes
          })
      }
    },
    getDevices() {
      if (!this.error) {
        this.devices = [];
        let endpoint = `/api/device/`;
        apiService(endpoint)
          .then(data => {
            this.devices.push(...data.results);
            this.optionsDevices = this.devices
          })
      }
    },
    addAtt() {
      if (this.KeyAtt) {
        let endpoint = `/api/device-attribute/`;
        apiService(endpoint, "POST", { 
          txtKeyAttribute: this.KeyAtt,
          txtNameAttribute: this.NameAtt,
          txtValueAttribute: this.ValueAtt,
          txtValueType: this.ValueType,
          txtParameter: this.Parameter,
          idDevice: this.Device,
          })
          .then(response => {
            if (response != 'ERROR'){
              this.getAtt();
              this.emptyInput();
            }
          })
          .catch(err => console.log(err));
        
      }
    },
    openModal(params) {
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to delete the selected Attribute?", {
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
        .then(value => {
          if (value) {
            this.deleteAttribute(params);
          }
        })
    },
    async deleteAttribute(params) {
      let endpoint = `/api/device-attribute/${params.node.data.id}/`;
      try {
        await apiService(endpoint, "DELETE");
        this.getAtt();
      }
      catch (err) {
        console.log(err)
      }
    },
    emptyInput() {
      this.KeyAtt = '';
      this.NameAtt = '';
      this.ValueType = [];
      this.ValueAtt = '';
      this.Parameter = '';
      this.Device = [];
      this.show = false;
    },
    getDateToday() {
      var today = new Date();
      this.date = today.getDate()+' / '+(today.getMonth()+1)+' / '+today.getFullYear();
    },
  },
  created() {
    this.getAtt();
    this.getDevices();
    this.getDateToday();
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
