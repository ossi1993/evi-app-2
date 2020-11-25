<template>
  <!-- ============ Body content start ============= -->
  <div class="main-content">
    <breadcumb :page="'Device List'" :folder="'Device'" />
    <!-- ICON BG -->
    <b-row>
      <b-col lg="6" md="6" sm="12">
        <b-card class="card-icon-bg card-icon-bg-primary o-hidden mb-30 text-center">
          <i class="i-Computer-2"></i>
          <div class="content">
            <p class="text-muted mt-2 mb-0">Devices</p>
            <p class="inline text-primary text-24 line-height-1 mb-2">{{ this.devices.length }}</p>
          </div>
        </b-card>
      </b-col>
      <b-col lg="6" md="6" sm="12">
        <b-card class="card-icon-bg card-icon-bg-primary o-hidden mb-30 text-center">
          <i class="i-Calendar"></i>
          <div class="content">
            <p class="text-muted mt-2 mb-0">Date</p>
            <p class="text-primary text-24 line-height-1 mb-2"><nobr>{{ this.date }}</nobr></p>
          </div>
        </b-card>
      </b-col>
    </b-row>

    <!-- ##################################### -->
    <!-- ########### DEVICE SECTION ########## -->
    <!-- ##################################### -->
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0 mb-3">
            <b-row class="ml-3" >
              <i class="nav-icon i-Add mt-3" style="font-size: 20px" id="new-device-section" @click="emptyInput('add')"></i>
              <h5 class="card-title border-bottom p-3 mb-2">New Device</h5>
            </b-row>
            <div class="mt-3" v-show="show">
              <b-form @submit.prevent="onSubmit">
                <b-row class="ml-3 mt-3 mr-3">
                  <b-col md="6">
                    <b-form-input v-model="SNumber" type="text" placeholder="Serial Number" ></b-form-input>
                  </b-col>
                  <b-col md="6">
                    <b-form-input v-model="IMEI" type="text" placeholder="IMEI" ></b-form-input>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mt-3 mr-3">
                  <b-col md="6">
                    <v-select  id="select-1" v-model="Model" :options="optionsModels" required placeholder="Choose Model" 
                    label="txtModelName" :reduce="Model => Model.id"></v-select>
                  </b-col>
                  <b-col md="6">
                    <v-select v-model="DPosition" :options="positions" required placeholder="Choose Device Position" label="txtDevicePosition"></v-select>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="12">
                    <b-form-textarea id="area-1" v-model="Comment" placeholder="Enter memo ..." rows="3" max-rows="6"></b-form-textarea>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="12">
                    <multiselect
                        v-model="selectedAttributes" placeholder="Choose Attributes" label="txtNameAttribute" 
                        track-by="id" :options="optionAttributes" :multiple="true" :taggable="true" :close-on-select="false"
                        :searchable="true" open-direction="bottom">
                    </multiselect>
                  </b-col>
                </b-row>

                <!-- TEMPLATE ATTRIBUTES -->
                <b-row class="mt-3 ml-3 mr-3">
                  <b-col md="12">
                    <h5 class="mt-4" v-show="selectedAttributes.length != 0">Device Attributes</h5>
                    <b-row class="mb-3" v-for="att in selectedAttributes" :key="att.id">
                      <b-input-group v-if="att.txtValueType == 'Select'" class="ml-3 mr-3" :prepend="att.txtNameAttribute">
                        <b-form-select v-model="att.txtValueDefault" :options="getParameterTags(att.txtParameter)"></b-form-select>
                      </b-input-group>
                        <b-input-group v-else-if="att.txtValueType == 'Boolean'" class="ml-3 mr-3" :prepend="att.txtNameAttribute">
                          <b-form-select v-model="att.txtValueDefault" :options="optionBoolean"></b-form-select>
                        </b-input-group>
                      <b-input-group v-else class="ml-3 mr-3" :prepend="att.txtNameAttribute" :append="att.txtParameter">
                        <b-form-input v-model="att.txtValueDefault" type="text"></b-form-input>
                      </b-input-group>
                    </b-row>
                  </b-col>
                </b-row>

                <!-- UPDATE ATTRIBUTES -->
                <b-row class="mt-4 ml-3 mr-3" v-if="filteredAttributes.length != 0 && updateStatus">
                  <b-col md="12">
                    <h5 class="typo__label mb-3">Attributes of Item</h5>
                    <b-row class="mb-3" v-for="att in filteredAttributes" :key="att.id">
                      <b-input-group v-if="att.txtValueType == 'Select'" class="ml-3 mr-3" :prepend="att.txtNameAttribute">
                        <b-form-select v-model="att.txtValueAttribute" :options="getParameterTags(att.txtParameter)"></b-form-select>
                      </b-input-group>
                      <b-input-group v-else-if="att.txtValueType == 'Boolean'" class="ml-3 mr-3" :prepend="att.txtNameAttribute">
                        <b-form-select v-model="att.txtValueAttribute" :options="optionBoolean"></b-form-select>
                      </b-input-group>
                      <b-input-group v-else class="ml-3 mr-3" :prepend="att.txtNameAttribute" :append="att.txtParameter">
                        <b-form-input v-model="att.txtValueAttribute" type="text"></b-form-input>
                      </b-input-group>
                    </b-row>
                  </b-col>
                </b-row>
                
                <!-- NEW DEVICE / UPDATE DEVICE BUTTONS -->
                <b-row class="ml-3 mt-5 mr-3">
                  <b-col md="6" v-if="!updateStatus">
                    <b-button @click="emptyInput" block variant="outline-danger">Delete Input</b-button>
                  </b-col>
                  <b-col md="6" v-else-if="updateStatus">
                    <b-button @click="emptyInput" block variant="outline-info">Cancel</b-button>
                  </b-col>
                  <b-col md="6" v-if="!updateStatus">
                    <b-button type="submit" block variant="success" :disabled="disabled">Add Device</b-button>
                  </b-col>
                  <b-col md="6" v-else-if="updateStatus">
                    <b-button type="submit" block variant="warning" :disabled="disabled">Update Device</b-button>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mt-3 mr-3">
                  <b-col md="12">
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

    <!-- AG-GRID DEVICES -->
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0">
            <AgGridVue class="ag-theme-alpine"
                id="gridDevices"
                :defaultColDef="defaultColDef"
                :columnDefs="columnDefs"
                :rowSelection="rowSelection"
                :rowData="rowData"
                :gridOptions="gridOptions"
                :suppressRowClickSelection="true"
                @grid-ready="onGridReady"
                @cellValueChanged="updateDeviceGrid"
                @row-selected="onRowSelectedDevice"
                :pagination="true"
                :paginationPageSize="paginationPageSize"
                :getContextMenuItems="getContextMenu"
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
                <b-button @click="onBtExport" class="ml-3" size="sm" variant="outline-success">Export Excel</b-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AG-GRID ATTRIBUTES -->
    <div class="row" v-if="selectedDevice">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0">
            <h5 class="card-title p-3 pb-0 mb-3">Attributes</h5>
            <AgGridVue class="ag-theme-alpine"
                id="gridAttributes"
                @cellValueChanged="updateAttributeGrid"
                @grid-ready="onGridReady1"
                :defaultColDef="defaultColDef1"
                :columnDefs="columnDefs1"
                :rowSelection="rowSelection"
                :rowData="rowData1"
                :gridOptions="gridOptions1"
                :suppressRowClickSelection="true"
                :pagination="true"
                :paginationPageSize="50"
                :getContextMenuItems="getContextMenu1"
                :domLayout="domLayout"
                :modules="modules">
            </AgGridVue>
          </div>
        </div>
      </div>
    </div>

    <!-- AG-GRID STATS -->
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
    title: "Device"
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
      frameworkComponents: null,
      domLayout: null,
      modules: AllModules,

      // AG-GRID ATTRIBUTES VARIABLES
      gridOptions1: null,
      gridApi1: null,
      gridColumnApi1: null,
      defaultColDef1: null,
      columnDefs1: null,
      rowData1: null,
      defaultColDef1: null,
      paginationPageSize1: 0,

      // VUE VARIABLES
      devices: [],
      models: [],
      attributes: [],
      positions: [],
      tempAttributes: [],
      selectedAttributes: [],
      filteredAttributes: [],
      SNumber: null,
      DPosition: null,
      IMEI: null,
      Comment: null,
      Model: null,
      date: null,
      error: false,
      show: false,
      updateStatus: false,
      updateId: null,
      selectedDevice: false,
      optionsModels: [],
      optionAttributes: [],
      optionPosition: [
        { code: 'Neuried', text: 'Neuried' },
        { code: 'Straubing', text: 'Straubing' },
        { code: 'Ordered', text: 'Ordered' },
        { code: 'on the Way', text: 'on the Way' },
      ],
      optionBoolean: [
        { value: 'true', text: 'Yes' },
        { value: 'false', text: 'No' },
      ],
    };
  },
  beforeMount() {
    this.gridOptions = {};
    this.gridOptions1 = {};
    this.columnDefs = [
      {headerName: "Model Name", field: "idModel.txtModelName", filter: 'agTextColumnFilter', checkboxSelection: true,  editable: false},
      {headerName: "Serial Number", field: "txtSerialNumber", filter: 'agTextColumnFilter',},
      {headerName: "IMEI", field: "txtIMEI", filter: 'agTextColumnFilter',},
      {headerName: "Device Position", field: "idDevicePosition.txtDevicePosition", filter: 'agTextColumnFilter', cellEditor: 'agRichSelectCellEditor', cellEditorParams: { cellHeight: 50, values: ['Neuried', 'Straubing']},},
      {headerName: "Manufacturer", field: "idModel.idManufacturer.txtManufacturerName", filter: 'agTextColumnFilter', editable: false},
      {headerName: "Supplier", field: "idModel.idSupplier.txtSupplierName", filter: 'agTextColumnFilter', editable: false},
      {headerName: "Memo", field: "txtComment", filter: 'agTextColumnFilter', editable: false},
    ],
    this.columnDefs1 = [
      {headerName: "Key Attribute", field: "txtKeyAttribute", filter: 'agTextColumnFilter', },
      {headerName: "Name Attribute", field: "txtNameAttribute", filter: 'agTextColumnFilter', },
      {headerName: "Value Attribute", field: "txtValueAttribute", filter: 'agTextColumnFilter', },
      {headerName: "Value Type", field: "txtValueType", filter: 'agTextColumnFilter', },
      {headerName: "Parameter", field: "txtParameter", filter: 'agTextColumnFilter', },
    ],
    this.defaultColDef = { flex: 1, editable: true, resizable: true, sortable: true, filter: true, floatingFilter: true, };
    this.defaultColDef1 = { flex: 1, editable: true, resizable: true, sortable: true, filter: true, floatingFilter: true, };
    this.rowSelection = 'single';
    this.domLayout = 'autoHeight';
    this.paginationPageSize = 10;
    this.paginationPageSize1 = 10;
  },
  mounted() {
    if (JSON.parse(localStorage.getItem('device_columnStats')) != null) {
       this.gridOptions.columnApi.setColumnState(JSON.parse(localStorage.getItem('device_columnStats')));
    } else {
      this.gridApi = this.gridOptions.api;
      this.gridColumnApi = this.gridOptions.columnApi;
    }
  },
  computed: {
    disabled: function () {
      return !this.DPosition ? true : !this.Model ? true : false; 
    },
  },
  methods: {
    saveState() {
      localStorage.setItem('device_columnStats', JSON.stringify(this.gridOptions.columnApi.getColumnState()));
    },
    restoreState() {
      localStorage.setItem('device_columnStats', null);
    },
    onBtExport() {
      this.gridApi.exportDataAsExcel({});
    },
    onSubmit() {
      if(!this.updateStatus) { this.addDevice();
      } else { this.updateDevice(); }
    },
    onPageSizeChanged(newPageSize) {
      var value = document.getElementById('page-size').value;
      this.gridApi.paginationSetPageSize(Number(value));
    },
    onRowSelectedDevice(event) {
      this.selectedDevice = this.selectedDevice ? false : true
      if(event.node.selected == true) {
        this.getAttributes(event.data.id);
        window.localStorage.setItem('selDevice', event.node.data.id)
      } else {
        this.gridApi.redrawRows();
        this.attributes = [];
      }
    },
    onGridReady(params) { 
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi
      setTimeout(() => {  this.getSelectedDevice(params) }, 500);
    },
    onGridReady1(params) {
      this.gridApi1 = params.api;
      this.gridColumnApi1 = params.columnApi
    },
    addDevice() {
      if (this.SNumber) {
        let endpoint = `/api/device/`;
        apiService(endpoint, "POST", { 
          txtSerialNumber: this.SNumber, 
          txtIMEI: this.IMEI, 
          idDevicePosition: this.DPosition.id, 
          idModel: this.Model, 
          txtComment: this.Comment 
          })
        .then(response => {
          if (response != 'ERROR'){
              for (let i = 0; i < this.selectedAttributes.length; i++) {
                const el = this.selectedAttributes[i];
                let endpointAttributes = `/api/device-attribute/`;
                apiService(endpointAttributes, "POST", { 
                  txtKeyAttribute: el.txtKeyAttribute, 
                  txtNameAttribute: el.txtNameAttribute, 
                  txtValueAttribute: el.txtValueDefault, 
                  txtValueType: el.txtValueType, 
                  txtParameter: el.txtParameter,
                  idDevice: response.id,
                })
              };
            this.getDevices();
            this.emptyInput();
          }
        })
        .catch(err => console.log(err));
      }
    },
    editItemMenu(params) {
      this.emptyInput();
      let sel = params.node.data;
      this.SNumber = sel.txtSerialNumber;
      this.DPosition = sel.idDevicePosition;
      this.Model = sel.idModel;
      this.Comment = sel.txtComment;
      this.updateStatus = true;
      this.updateId = sel.id;
      this.show = true;
      this.getAttributes()
      document.documentElement.scrollTop = 0;
    },
    async updateDevice() {
      if(typeof this.Model == "object") { this.Model = this.Model.id } else { this.Model = this.Model }
      let endpoint = `/api/device/${this.updateId}/`;
      await apiService(endpoint, "PUT", { 
        txtSerialNumber: this.SNumber,
        txtIMEI: this.IMEI,
        idDevicePosition: this.DPosition.id,
        txtComment: this.Comment,
        idModel: this.Model, })
        .then(response => {
          if (response != 'ERROR'){
            // ADD ATTRIBUTE
            for (let i = 0; i < this.selectedAttributes.length; i++) {
              const el = this.selectedAttributes[i];
              let endpointAttributes = `/api/device-attribute/`;
              apiService(endpointAttributes, "POST", { 
                txtKeyAttribute: el.txtKeyAttribute, 
                txtNameAttribute: el.txtNameAttribute, 
                txtValueAttribute: el.txtValueDefault, 
                txtValueType: el.txtValueType, 
                txtParameter: el.txtParameter,
                idDevice: response.id,
              })
            }
            // UPDATE ATTRIBUTE
            for (let i = 0; i < this.filteredAttributes.length; i++) {
              let el = this.filteredAttributes[i];
              let endpointAttributes = `/api/device-attribute/${el.id}/`;
              apiService(endpointAttributes, "PUT", { 
                txtKeyAttribute: el.txtKeyAttribute, 
                txtNameAttribute: el.txtNameAttribute, 
                txtValueAttribute: el.txtValueAttribute, 
                txtValueType: el.txtValueType, 
                txtParameter: el.txtParameter,
                idDevice: response.id,
              })
            };
            this.selectedDevice = false;
            this.attributes = [];
            this.emptyInput();
            this.getDevices();
          }
        })
        .catch(err => console.log(err));
    },
    async updateDeviceGrid(event) {     
      let endpoint = `/api/device/${event.node.data.id}/`;
      try {
        await apiService(endpoint, "PATCH", { 
          txtSerialNumber: event.node.data.txtSerialNumber,
          txtParameter: event.node.data.txtParameter,
          idDevicePosition: event.node.data.idDevicePosition,
          txtComment: event.node.data.txtComment,
        })
        .catch(err => console.log(err));
      }
      catch (err) {
        console.log(err)
      }
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
        })
        .catch(err => console.log(err));
      }
      catch (err) {
        console.log(err)
      }
    },
    openModal(params) {
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to delete the selected Device? => " + params.node.data.txtSerialNumber, {
          title: "Please Confirm", size: "m", buttonSize: "sm", okVariant: "danger", okTitle: "YES",
          cancelTitle: "NO", footerClass: "p-2", hideHeaderClose: false, centered: true })
        .then(value => { if (value) { this.deleteDevice(params); } })
        .catch(err => console.log(err));
    },
    openModal1(params) {
      this.$bvModal
        .msgBoxConfirm("Do you really want to delete the Attribute? => " + params.node.data.txtNameAttribute, {
          title: "Please Confirm", size: "m", buttonSize: "sm", okVariant: "danger", okTitle: "YES",
          cancelTitle: "NO", footerClass: "p-2", hideHeaderClose: false, centered: true })
        .then(value => { if (value) { this.deleteAttribute(params); } })
        .catch(err => console.log(err));
    },
    async deleteDevice(params) {
      let endpoint = `/api/device/${params.node.data.id}/`;
      await apiService(endpoint, "DELETE")
        .then(response => {
          if (response != 'ERROR') {
            this.getDevices();
          } else {
            this.$bvToast.toast(`Can't delete this entry. Please check if there are dependent entries. Please delete those first!`, {
              title: 'DELETE WARNING', variant: 'danger', autoHideDelay: 6000, appendToast: false
            })
          }
        })
    },
    async deleteAttribute(params) {
      let endpoint = `/api/device-attribute/${params.node.data.id}/`;
      await apiService(endpoint, "DELETE")
        .then(response => {
          if (response != 'ERROR') {
            let id = window.localStorage.getItem('selDevice');
            this.getAttributes(id);
          } else {
            this.$bvToast.toast(`Can't delete this entry. Please check if there are dependent entries. Please delete those first!`, {
              title: 'DELETE WARNING', variant: 'danger', autoHideDelay: 6000, appendToast: false
            })
          }
        })
    },
    emptyInput(event) {
      this.selectedAttributes = [];
      this.SNumber = this.DPosition = this.Model = this.IMEI = this.Comment = null;
      if(event != 'add') {
        this.show = false;
      } else {
        this.updateStatus = false;
        this.show = !this.show;
      }
    },
    getDevices() {
      if (!this.error) {
        this.devices = [];
        let endpoint = `/api/device-list/`;
        apiService(endpoint)
          .then(data => {
            this.devices.push(...data.results);
            this.rowData = this.devices
          })
          .catch(err => console.log(err));
      }
    },
    getModels() {
      if (!this.error) {
        this.models = [];
        let endpoint = `/api/model/`;
        apiService(endpoint)
          .then(data => {
            this.models.push(...data.results);
            this.optionsModels = this.models
          })
          .catch(err => console.log(err));
      }
    },
    getAttributes(val) {
      if (!this.error) {
        this.attributes = [];
        let endpoint = `/api/device-attribute/`;
        apiService(endpoint)
          .then(data => {
            this.attributes.push(...data.results);
            if(this.updateId != null) {
              this.filteredAttributes = this.attributes.filter(e => e.idDevice == this.updateId)
            }
            if(val != null) {
              this.rowData1 = this.attributes.filter(e => e.idDevice == val)
            }
          })
          .catch(err => console.log(err));
      }
    },
    getTemplateAttributes() {
      if (!this.error) {
        this.tempAttributes = [];
        let endpoint = `/api/device-template-attribute/`;
        apiService(endpoint)
          .then(data => {
            this.tempAttributes.push(...data.results);
            this.optionAttributes = this.tempAttributes
          })
          .catch(err => console.log(err));
      }
    },
    getDevicePosition() {
      if (!this.error) {
        this.positions = [];
        let endpoint = `/api/device-position/`;
        apiService(endpoint)
          .then(data => {
            this.positions.push(...data.results);
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
          name: 'Edit Device',
          action: () => this.editItemMenu(params)
        },
        'separator',
        {
          name: 'Delete Device',
          action: () =>  this.openModal(params)
        },
        'export'
      ];
      return result;
    },
    getContextMenu1(params) {
      var result = [
        {
          name: 'Delete Attribute',
          action: () => this.openModal1(params)
        },
        'separator',
        'export'
      ];
      return result;
    },
    getSelectedDevice(event) {
      if(window.localStorage.getItem('selDevice') != null) {
        let el = parseInt(localStorage.getItem('selDevice'));
        event.api.forEachNode(rowNode => { rowNode.setSelected(rowNode.data.id === el) });
      }
    },
  },
  created() {
    this.getDevices();
    this.getModels();
    this.getDateToday();
    this.getTemplateAttributes();
    this.getDevicePosition();
  },
  beforeRouteLeave (to, from, next) {
    window.localStorage.removeItem('selDevice');
    next()
  }
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
  #new-device-section {
    cursor: pointer;
    outline: none;
  }
</style>
