<template>
  <!-- ============ Body content start ============= -->
  <div class="main-content">
    <breadcumb :page="'Inspection Type'" :folder="'Inspection'" />
    <b-row>
      <!-- ICON BG -->
      <b-col lg="6" md="6" sm="12">
        <b-card class="card-icon-bg card-icon-bg-primary o-hidden mb-30 text-center">
          <i class="i-Check"></i>
          <div class="content">
            <p class="text-muted mt-2 mb-0">Types</p>
            <p class="inline text-primary text-24 line-height-1 mb-2">{{ this.inspectionTypes.length }}</p>
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
              <h5 class="card-title border-bottom p-3 mb-2">New Inspection Type</h5>
            </b-row>
            <div class="ml-3 mr-3" v-show="show">
              <b-row class="ml-3 mr-3 mt-3">
                <b-col md="6">
                  <b-form-input id="input-1" v-model="InspectionType" type="text" placeholder="Inspection Type" ></b-form-input>
                </b-col>
                <b-col md="6">
                  <b-form-input id="input-2" v-model="InspectionInitial" type="text" placeholder="Inspection Initial" ></b-form-input>
                </b-col>
              </b-row>

              <!-- NEW INSPECTION TYPE / UPDATE INSPECTION TYPE BUTTONS -->
              <b-row class="ml-3 mr-3 mt-5">
                <b-col md="6" v-if="!updateStatus">
                  <b-button @click="emptyInput" block variant="outline-danger">Delete Input</b-button>
                </b-col>
                <b-col md="6" v-else-if="updateStatus">
                  <b-button @click="emptyInput" block variant="outline-info">Cancel</b-button>
                </b-col>
                <b-col md="6" v-if="!updateStatus">
                  <b-button @click="addInspectionType" block variant="success" :disabled="disabled">Add Inspection Type</b-button>
                </b-col>
                <b-col md="6" v-else-if="updateStatus">
                  <b-button @click="updateInspectionType" block variant="warning" :disabled="disabled">Update Inspection Type</b-button>
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
                id="gridInspectionType"
                :defaultColDef="defaultColDef"
                :columnDefs="columnDefs"
                :rowSelection="rowSelection"
                :rowData="rowData"
                :gridOptions="gridOptions"
                :suppressRowClickSelection="true"
                @cellValueChanged="updateInspectionTypeGrid"
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
    title: "Inspection Types"
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
      inspectionTypes: [],
      InspectionType: null,
      InspectionInitial: null,
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
    this.columnDefs = [
      {headerName: "Inspection Type", field: "txtInspectionType", filter: 'agTextColumnFilter', },
      {headerName: "Inspection Initial", field: "txtInspectionInitial", filter: 'agTextColumnFilter', },
      ]
  },
  mounted() {
    if (JSON.parse(localStorage.getItem('inspectionTypes_columnStats')) != null) {
       this.gridOptions.columnApi.setColumnState(JSON.parse(localStorage.getItem('inspectionTypes_columnStats')));
    } else {
      this.gridApi = this.gridOptions.api;
      this.gridColumnApi = this.gridOptions.columnApi;
    }
  },
  computed: {
    disabled: function () {
      return !this.InspectionType ? true : !this.InspectionInitial ? true : false; 
    },
  },
  methods: {
    saveState() {
      localStorage.setItem('inspectionTypes_columnStats', JSON.stringify(this.gridOptions.columnApi.getColumnState()));
    },
    restoreState() {
      localStorage.setItem('inspectionTypes_columnStats', null);
    },
    onBtExport() {
      this.gridApi.exportDataAsExcel({});
    },
    onPageSizeChanged(newPageSize) {
      var value = document.getElementById('page-size').value;
      this.gridApi.paginationSetPageSize(Number(value));
    },
    addInspectionType() {
      let endpoint = `/api/inspection-type/`;
      apiService(endpoint, "POST", { 
        txtInspectionType: this.InspectionType, 
        txtInspectionInitial: this.InspectionInitial, 
        })
        .then(response => {
          if (response != 'ERROR'){
            this.getInspectionTypes();
            this.emptyInput();
          }
        })
        .catch(err => console.log(err));
    },
    editInspectionTypeMenu(params) {
      this.emptyInput();
      let sel = params.node.data;
      this.InspectionType = sel.txtInspectionType;
      this.InspectionInitial = sel.txtInspectionInitial;
      this.updateStatus = true;
      this.updateId = sel.id;
      this.show = true;
      document.documentElement.scrollTop = 0;
    },
    async updateInspectionType() {
      let endpoint = `/api/inspection-type/${this.updateId}/`;
      await apiService(endpoint, "PUT", { 
        txtInspectionType: this.InspectionType, 
        txtInspectionInitial: this.InspectionInitial, 
        })
        .then(response => {
          if (response != 'ERROR'){
            this.emptyInput();
            this.getInspectionTypes();
          }
        })
        .catch(err => console.log(err));
    },
    async updateInspectionTypeGrid(event) {     
      let endpoint = `/api/inspection-type/${event.node.data.id}/`;
      try {
        await apiService(endpoint, "PATCH", { 
          txtInspectionType: event.node.data.txtInspectionType, 
          txtInspectionInitial: event.node.data.txtInspectionInitial, 
          })
        .catch(err => console.log(err));
      }
      catch (err) {
        console.log(err)
      }
    },
    openModal(params) {
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to delete the selected Inspection Type?", {
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
        .then(value => { if (value) { this.deleteInspectionType(params); } })
        .catch(err => console.log(err));
    },
    async deleteInspectionType(params) {
      let endpoint = `/api/inspection-type/${params.node.data.id}/`;
      await apiService(endpoint, "DELETE")
        .then(response => {
          if (response != 'ERROR') {
            this.getInspectionTypes();
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
      this.InspectionType = this.InspectionInitial = null;
      if(event != 'add') {
        this.show = false;
      } else {
        this.updateStatus = false;
        this.show = !this.show;
      }
    },
    getInspectionTypes() {
      if (!this.error) {
        this.inspectionTypes = [];
        let endpoint = `/api/inspection-type/`;
        apiService(endpoint)
          .then(data => {
            this.inspectionTypes.push(...data.results);
            this.rowData = this.inspectionTypes
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
          name: 'Edit Inspection Type',
          action: () => this.editInspectionTypeMenu(params)
        },
        'separator',
        {
          name: 'Delete Inspection Type',
          action: () =>  this.openModal(params)
        },
        'export'
      ];
      return result;
    },
  },
  created() {
    this.getDateToday();
    this.getInspectionTypes();
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
