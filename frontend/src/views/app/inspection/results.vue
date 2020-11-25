<template>
  <!-- ============ Body content start ============= -->
  <div class="main-content">
    <breadcumb :page="'Results'" :folder="'Inspection'" />
    <!-- ICON BG -->
    <b-row>
      <b-col lg="6" md="6" sm="12">
        <b-card class="card-icon-bg card-icon-bg-primary o-hidden mb-30 text-center">
          <i class="i-File-Clipboard-File--Text"></i>
          <div class="content">
            <p class="text-muted mt-2 mb-0">Results</p>
            <p class="inline text-primary text-24 line-height-1 mb-2">{{ this.results.length }}</p>
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
    <!-- ########### RESULT SECTION ########## -->
    <!-- ##################################### -->
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0 mb-3">
            <b-row class="ml-3">
              <i class="nav-icon i-Add mt-3" style="font-size: 20px" @click="emptyInput('add')" id="new-result-section"></i>
              <h5 class="card-title border-bottom p-3 mb-2">New Result</h5>
            </b-row>
            <div class="mt-3" v-show="show">
              <b-form @submit.prevent="onSubmit">
                <b-row class="ml-3 mr-3">
                  <b-col md="2" class="mt-3">
                    <b-form-input v-model="ReleasedBy" type="text" placeholder="Released by" ></b-form-input>
                  </b-col>
                  <b-col md="4" class="mt-3">
                      <b-form-datepicker  v-model="ReleaseDate" placeholder="Release Date" ></b-form-datepicker >
                  </b-col>
                  <b-col md="3" class="mt-3">
                    <v-select v-model="ReleaseStatus" :options="optionReleaseStatus" placeholder="Choose Release Status" 
                    :reduce="ReleaseStatus => ReleaseStatus.code"></v-select>
                  </b-col>
                  <b-col md="3" class="mt-3">
                    <v-select v-model="Reference" :options="optionReference" placeholder="Choose Reference Status" 
                    :reduce="Reference => Reference.code"></v-select>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3">
                  <b-col md="3" class="mt-3">
                    <v-select v-model="OrderItem" :options="orderItems" placeholder="Choose Order Item" @input="getSample()"
                    :get-option-label='label => label.idOrder.txtOrderNumber + " - " + label.idItem.txtDescription'></v-select>
                  </b-col>
                  <b-col md="3" class="mt-3">
                    <v-select v-model="Inspection" :options="inspections" placeholder="Choose Inspection" @input="getSample()"
                    :get-option-label='label => label.txtInspectionNumber + " - " + label.txtInspectionType'></v-select>
                  </b-col>
                  <b-col md="3" class="mt-3">
                    <v-select v-model="Sample" :options="optionSamples" placeholder="Choose Sample" :disabled="!selectSample"
                    :get-option-label='label => label.idInspection.txtInspectionNumber + " - " + label.idOrderItem.idItem.txtDescription'></v-select>
                  </b-col>
                  <b-col md="3" class="mt-3">
                    <v-select v-model="Model" :options="models" label="txtModelName" placeholder="Choose Model"></v-select>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3">
                  <b-col md="12" class="mt-4">
                    <b-form-input v-model="Link" type="text" placeholder="Link" ></b-form-input>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="12">
                    <b-form-textarea v-model="Comment" placeholder="Enter memo ..." rows="3" max-rows="6"></b-form-textarea>
                  </b-col>
                </b-row>
                
                <!-- NEW RESULT / UPDATE RESULT BUTTONS -->
                <b-row class="ml-3 mt-5 mr-3">
                  <b-col md="6" v-if="!updateStatus">
                    <b-button @click="emptyInput" block variant="outline-danger">Delete Input</b-button>
                  </b-col>
                  <b-col md="6" v-else-if="updateStatus">
                    <b-button @click="emptyInput" block variant="outline-info">Cancel</b-button>
                  </b-col>
                  <b-col md="6" v-if="!updateStatus">
                    <b-button type="submit" block variant="success" :disabled="disabled">Add Result</b-button>
                  </b-col>
                  <b-col md="6" v-else-if="updateStatus">
                    <b-button type="submit" block variant="warning" :disabled="disabled">Update Result</b-button>
                  </b-col>
                </b-row>
                <!-- ERROR MESSAGE -->
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

    <!-- AG-GRID INSPECTION -->
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0">
            <h5 class="card-title p-3 pb-0 mb-3">Results</h5>
            <AgGridVue class="ag-theme-alpine"
                id="gridResult"
                :defaultColDef="defaultColDef"
                :columnDefs="columnDefs"
                :rowSelection="rowSelection"
                :rowData="rowData"
                :gridOptions="gridOptions"
                :suppressRowClickSelection="true"
                :excelStyles="excelStyles"
                @cellValueChanged="updateResultGrid"
                @gridReady="onGridReady"
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
                <b-button @click="excelExportResult" class="ml-3" size="sm" variant="outline-success">Export Excel</b-button>
            </div>
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
    title: "Inspection"
  },
  components: {
    AgGridVue
  },
  data() {
    return {
      // AG-GRID INSPECTION VARIABLES
      gridOptions: null,
      gridApi: null,
      columnApi: null,
      columnDefs: null,
      rowData: null,
      rowSelection: null,
      defaultColDef: null,
      excelStyles: null,
      frameworkComponents: null,
      modules: AllModules,
      domLayout: null,
      paginationPageSize: 0,
      params: null,
      eGui: null,

      // VUE VARIABLES
      results: [],
      orderItems: [],
      samples: [],
      optionSamples: [],
      models: [],
      inspections: [],
      suppliers: [],

      Directory: null,
      ReleasedBy: null,
      ReleaseDate: null,
      ReleaseStatus: null,
      Reference: false,
      Link: null,
      Comment: null,
      OrderItem: null,
      Sample: null,
      Model: null,
      Inspection: null,
      Supplier: null,
      show: false,
      date: null,
      error: false,
      selectSample: false,
      updateStatus: false,
      updateId: null,
      optionReference: [
        { code: true, label: 'Yes' },
        { code: false, label: 'No' },
      ],
      optionReleaseStatus: [
        { code: 'Approved', label: 'Approved' },
        { code: 'Not Approved', label: 'Not Approved' },
        { code: 'Cancelled', label: 'Cancelled' },
      ]
    };
  },
  beforeMount() {
    this.gridOptions = {};
    this.columnDefs = [
      {headerName: "Released by", field: "txtReleasedBy", filter: 'agTextColumnFilter', },
      {headerName: "Release Date", field: "datReleaseDate", filter: 'agTextColumnFilter', editable: false, },
      {headerName: "Release Status", field: "txtReleaseStatus", filter: 'agTextColumnFilter', 
      cellEditor: 'agRichSelectCellEditor', cellEditorParams: { cellHeight: 50, values: ['Approved', 'Not Approved', 'Cancelled']}},
      {headerName: "Reference", field: "blnReference", filter: 'agTextColumnFilter', valueGetter: blnValueGetter, editable: false, },
      {headerName: "Model", field: "idModel.txtModelName", filter: 'agTextColumnFilter', editable: false, },
      {headerName: "Supplier", field: "idSample.idOrderItem.idOrder.idSupplier.txtSupplierName", filter: 'agTextColumnFilter', editable: false, },
      {headerName: "Sample", field: "idSample.idOrderItem.idItem.txtDescription", filter: 'agTextColumnFilter', editable: false, },
      {headerName: "Inspection", field: "idSample.idInspection.txtInspectionNumber", filter: 'agTextColumnFilter', editable: false, },
      {headerName: "Link", field: "txtLink", filter: 'agTextColumnFilter', editable: false, },
      {headerName: "Memo", field: "txtComment", filter: 'agTextColumnFilter', editable: false, },
    ],
    this.defaultColDef = { flex: 1, editable: true, resizable: true, sortable: true, filter: true, floatingFilter: true, };
    this.rowSelection = 'single';
    this.domLayout = 'autoHeight';
    this.paginationPageSize = 10;
  },
  mounted() {
    if (JSON.parse(localStorage.getItem('result_columnStats')) != null) {
       this.gridOptions.columnApi.setColumnState(JSON.parse(localStorage.getItem('result_columnStats')));
    } else {
      this.gridApi = this.gridOptions.api;
      this.gridColumnApi = this.gridOptions.columnApi;
    }
  },
  computed: {
    disabled: function() {
      return !this.ReleasedBy ? true : !this.ReleaseDate ? true : !this.ReleaseStatus ? true : !this.Sample ? true : !this.Model ? true : false;
    },
  },
  methods: {
    getSample() {
      if(this.OrderItem != null && this.Inspection != null) {
        this.getSamples(this.OrderItem.id, this.Inspection.id);
        if(this.optionSamples != null)
          this.selectSample = true;
      } else {
        this.selectSample = false;
        this.samples = [];
      }
    },
    saveState() {
      localStorage.setItem('result_columnStats', JSON.stringify(this.gridOptions.columnApi.getColumnState()));
    },
    restoreState() {
      localStorage.setItem('result_columnStats', null);
    },
    excelExportResult() {
      this.gridApi.exportDataAsExcel({});
    },
    onSubmit() {
      if(!this.updateStatus) { this.addResult();
      } else { this.updateResult(); }
    },
    onGridReady(params) { 
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi
    },
    onPageSizeChanged(newPageSize) {
      var value = document.getElementById('page-size').value;
      this.gridOptions.paginationSetPageSize(Number(value));
    },
    addResult() {
      let endpoint = `/api/result/`;
      apiService(endpoint, "POST", { 
        txtReleasedBy: this.ReleasedBy,
        datReleaseDate: this.ReleaseDate,
        txtReleaseStatus: this.ReleaseStatus,
        blnReference: this.Reference,
        txtLink: this.Link,
        txtComment: this.Comment,
        idSample: this.Sample.id,
        idModel: this.Model.id,
        })
        .then(response => {
          if (response != 'ERROR') {
            this.getResults();
            this.emptyInput()
          }
        })
        .catch(err => console.log(err));
    },
    editResultMenu(params) {
      this.emptyInput();
      let sel = params.node.data;
      this.ReleasedBy = sel.txtReleasedBy;
      this.ReleaseDate = sel.datReleaseDate;
      this.ReleaseStatus = sel.txtReleaseStatus;
      this.Reference = sel.blnReference;
      this.Link = sel.txtLink;
      this.Comment = sel.txtComment;
      this.Sample = sel.idSample;
      this.Model = sel.idModel;
      this.OrderItem = sel.idSample.idOrderItem;
      this.Inspection = sel.idSample.idInspection;
      this.Supplier = sel.idSample.idOrderItem.idOrder.idSupplier;
      this.updateStatus = true;
      this.updateId = sel.id;
      this.show = true;
      document.documentElement.scrollTop = 0;
    },
    async updateResult() {
      let endpoint = `/api/result/${this.updateId}/`;
      await apiService(endpoint, "PATCH", { 
        txtReleasedBy: this.ReleasedBy,
        datReleaseDate: this.ReleaseDate,
        txtReleaseStatus: this.ReleaseStatus,
        blnReference: this.Reference,
        txtLink: this.Link,
        txtComment: this.Comment,
        idSample: this.Sample.id,
        idModel: this.Model.id,
        })
        .then(response => {
          if (response != 'ERROR'){
            this.emptyInput();
            this.getResults();
          }
        })
        .catch(err => console.log(err));
    },
    async updateResultGrid(event) {     
      let endpoint = `/api/result/${event.node.data.id}/`;
      try {
        await apiService(endpoint, "PATCH", { 
          txtReleasedBy: event.node.data.txtReleasedBy,
          datReleaseDate: event.node.data.datReleaseDate,
          txtReleaseStatus: event.node.data.txtReleaseStatus,
          blnReference: event.node.data.blnReference,
          txtLink: event.node.data.txtLink,
          txtComment: event.node.data.txtComment,
        })
        .catch(err => console.log(err));
      }
      catch (err) {
        console.log(err)
      }
    },
    openModal(params) {
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to delete the selected Result?", {
          title: "Please Confirm", size: "m", buttonSize: "sm", okVariant: "danger", okTitle: "YES",
          cancelTitle: "NO", footerClass: "p-2", hideHeaderClose: false, centered: true })
        .then(value => { if (value) { this.deleteResult(params); } })
        .catch(err => console.log(err));
    },
    async deleteResult(params) {
      let endpoint = `/api/result/${params.node.data.id}/`;
      await apiService(endpoint, "DELETE")
        .then(response => {
          if (response != 'ERROR') {
            this.getResults();
          } else {
            this.$bvToast.toast(`Can't delete this entry. Please check if there are dependent entries. Please delete those first!`, {
              title: 'DELETE WARNING', variant: 'danger', autoHideDelay: 6000, appendToast: false
            })
          }
        })
    },
    emptyInput(event) {
      this.ReleasedBy = this.ReleaseDate = this.ReleaseStatus = this.Reference = this.Link = null;
      this.Comment = this.Sample = this.Model = this.Inspection = this.OrderItem = this.Supplier = null;
      if(event != 'add') {
        this.show = false;
      } else {
        this.updateStatus = false;
        this.show = !this.show;
      }
    },
    getResults() {
      this.results = [];
      let endpoint = `/api/result-list/`;
      apiService(endpoint)
        .then(data => {
          this.results.push(...data.results);
          this.rowData = this.results
        })
        .catch(err => console.log(err));
    },
    getSamples(id1, id2) {
      this.samples = [];
      let endpoint = `/api/sample-list/`;
      apiService(endpoint)
        .then(data => {
          this.samples.push(...data.results);
          this.optionSamples = this.samples.filter(e => e.idOrderItem.id === id1 && e.idInspection.id === id2);
        })
        .catch(err => console.log(err));
    },
    getOrderItem() {
      this.orderItems = [];
      let endpoint = `/api/order-item-list/`;
      apiService(endpoint)
        .then(data => {this.orderItems.push(...data.results);})
        .catch(err => console.log(err));
    },
    getModels() {
      this.models = [];
      let endpoint = `/api/model/`;
      apiService(endpoint)
        .then(data => {this.models.push(...data.results);})
        .catch(err => console.log(err));
    },
    getInspections() {
      this.inspections = [];
      let endpoint = `/api/inspection/`;
      apiService(endpoint)
        .then(data => {this.inspections.push(...data.results);})
        .catch(err => console.log(err));
    },
    getSuppliers() {
      this.suppliers = [];
      let endpoint = `/api/supplier/`;
      apiService(endpoint)
        .then(data => {this.suppliers.push(...data.results);})
        .catch(err => console.log(err));
    },
    getDateToday() {
      var today = new Date();
      this.date = today.getDate()+' / '+(today.getMonth()+1)+' / '+today.getFullYear();
    },
    getContextMenu(params) {
      var result = [
        {
          name: 'Edit Result',
          action: () => this.editResultMenu(params)
        },
        'separator',
        {
          name: 'Delete Result',
          action: () => this.openModal(params)
        },
        'export'
      ];
      return result;
    },
  },
  created() {
    this.getDateToday();
    this.getResults();
    this.getModels();
    this.getInspections();
    this.getSuppliers();
    this.getOrderItem();
  },
};

window.blnValueGetter = function(params) {
  return !params.data.blnReference ? 'No' : 'Yes'
}

</script>

<style>

  i:focus,
  input:focus,
  select:focus,
  textarea:focus,
  button:focus {
      outline: none;
  }
  #new-result-section {
    cursor: pointer;
    outline: none;
  }
  
</style>
