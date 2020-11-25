<template>
  <!-- ============ Body content start ============= -->
  <div class="main-content">
    <breadcumb :page="'Device Position'" :folder="'Device'" />
    <b-row>
      <!-- ICON BG -->
      <b-col lg="6" md="6" sm="12">
        <b-card class="card-icon-bg card-icon-bg-primary o-hidden mb-30 text-center">
          <i class="i-Map"></i>
          <div class="content">
            <p class="text-muted mt-2 mb-0">Item Type</p>
            <p class="inline text-primary text-24 line-height-1 mb-2">{{ this.devicePositions.length }}</p>
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
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0 mb-3">
            <b-row class="ml-3">
              <i class="nav-icon i-Add mt-3" style="font-size: 20px" id="new-attribute-section" @click="emptyInput('add')"></i>
              <h5 class="card-title border-bottom p-3 mb-2">New Device Position</h5>
            </b-row>
            <div class="ml-3 mr-3" v-show="show">
              <b-row class="ml-3 mr-3 mt-3">
                <b-col md="12">
                  <b-form-input id="input-1" v-model="DevicePosition" type="text" placeholder="Device Position" ></b-form-input>
                </b-col>
              </b-row>

              <!-- NEW STANDARD VALUE / UPDATE STANDARD VALUE BUTTONS -->
              <b-row class="ml-3 mr-3 mt-5">
                <b-col md="6" v-if="!updateStatus">
                  <b-button @click="emptyInput" block variant="outline-danger">Delete Input</b-button>
                </b-col>
                <b-col md="6" v-else-if="updateStatus">
                  <b-button @click="emptyInput" block variant="outline-info">Cancel</b-button>
                </b-col>
                <b-col md="6" v-if="!updateStatus">
                  <b-button @click="addDevicePosition" block variant="success" :disabled="disabled">Add Device Position</b-button>
                </b-col>
                <b-col md="6" v-else-if="updateStatus">
                  <b-button @click="updateDevicePosition" block variant="warning" :disabled="disabled">Update Device Position</b-button>
                </b-col>
              </b-row>

              <!-- ERROR MESSAGE -->
              <b-row class="ml-3 mr-3">
                <b-col md="12" class="mt-3">
                  <b-alert v-if="error" show variant="alert alert-card alert-danger" dismissible>
                    <strong class="text-capitalize">Error!</strong> The Input is not valid.
                  </b-alert>
                </b-col>
              </b-row>
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
                id="gridDevicePosition"
                :defaultColDef="defaultColDef"
                :columnDefs="columnDefs"
                :rowSelection="rowSelection"
                :rowData="rowData"
                :gridOptions="gridOptions"
                :suppressRowClickSelection="true"
                @cellValueChanged="updateDevicePositionGrid"
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
    title: "Device Position"
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

      // VUE VARIABLES
      devicePositions: [],
      DevicePosition: null,
      date: null,
      error: false,
      show: false,
      updateStatus: false,
      updateId: null,
    };
  },
  beforeMount() {
    this.gridOptions = {};
    this.defaultColDef = { flex: 1, editable: true, resizable: true, sortable: true, filter: true, floatingFilter: true, };
    this.rowSelection = 'single';
    this.domLayout = 'autoHeight';
    this.paginationPageSize = 10;
    this.columnDefs = [{headerName: "Device Position", field: "txtDevicePosition", filter: 'agTextColumnFilter', }]
  },
  mounted() {
    if (JSON.parse(localStorage.getItem('devicePosition_columnStats')) != null) {
       this.gridOptions.columnApi.setColumnState(JSON.parse(localStorage.getItem('devicePosition_columnStats')));
    } else {
      this.gridApi = this.gridOptions.api;
      this.gridColumnApi = this.gridOptions.columnApi;
    }
  },
  computed: {
    disabled: function () {
      return !this.DevicePosition ? true : false; 
    },
  },
  methods: {
    saveState() {
      localStorage.setItem('devicePosition_columnStats', JSON.stringify(this.gridOptions.columnApi.getColumnState()));
    },
    restoreState() {
      localStorage.setItem('devicePosition_columnStats', null);
    },
    onBtExport() {
      this.gridApi.exportDataAsExcel({});
    },
    onPageSizeChanged(newPageSize) {
      var value = document.getElementById('page-size').value;
      this.gridApi.paginationSetPageSize(Number(value));
    },
    addDevicePosition() {
      let endpoint = `/api/device-position/`;
      apiService(endpoint, "POST", { txtDevicePosition: this.DevicePosition, })
        .then(response => {
          if (response != 'ERROR'){
            this.getDevicePosition();
            this.emptyInput();
          }
        })
        .catch(err => console.log(err));
    },
    editDevicePositionMenu(params) {
      this.emptyInput();
      let sel = params.node.data;
      this.DevicePosition = sel.txtDevicePosition;
      this.updateStatus = true;
      this.updateId = sel.id;
      this.show = true;
      document.documentElement.scrollTop = 0;
    },
    async updateDevicePosition() {
      let endpoint = `/api/device-position/${this.updateId}/`;
      await apiService(endpoint, "PUT", { txtDevicePosition: this.DevicePosition, })
        .then(response => {
          if (response != 'ERROR'){
            this.emptyInput();
            this.getDevicePosition();
          }
        })
        .catch(err => console.log(err));
    },
    async updateDevicePositionGrid(event) {     
      let endpoint = `/api/device-position/${event.node.data.id}/`;
      try {
        await apiService(endpoint, "PATCH", { txtDevicePosition: event.node.data.txtDevicePosition, })
        .catch(err => console.log(err));
      }
      catch (err) {
        console.log(err)
      }
    },
    openModal(params) {
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to delete the selected Device Position?", {
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
        .then(value => { if (value) { this.deleteDevicePosition(params); } })
        .catch(err => console.log(err));
    },
    async deleteDevicePosition(params) {
      let endpoint = `/api/device-position/${params.node.data.id}/`;
      await apiService(endpoint, "DELETE")
        .then(response => {
          if (response != 'ERROR') {
            this.getDevicePosition();
          } else {
            this.$bvToast.toast(`Can't delete this entry. Please check if there are dependent entries. Please delete those first!`, {
              title: 'DELETE WARNING',
              variant: 'danger',
              autoHideDelay: 6000,
              appendToast: false
            })
          }
        })
    },
    emptyInput(event) {
      this.DevicePosition = null;
      if(event != 'add') {
        this.show = false;
      } else {
        this.updateStatus = false;
        this.show = !this.show;
      }
    },
    getDevicePosition() {
      if (!this.error) {
        this.devicePositions = [];
        let endpoint = `/api/device-position/`;
        apiService(endpoint)
          .then(data => {
            this.devicePositions.push(...data.results);
            this.rowData = this.devicePositions
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
          name: 'Edit Device Position',
          action: () => this.editDevicePositionMenu(params)
        },
        'separator',
        {
          name: 'Delete Device Position',
          action: () =>  this.openModal(params)
        },
        'export'
      ];
      return result;
    },
  },
  created() {
    this.getDateToday();
    this.getDevicePosition();
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
  #new-attribute-section {
    cursor: pointer;
    outline: none;
  }
</style>
