<template>
  <!-- ============ Body content start ============= -->
  <div class="main-content">
    <breadcumb :page="'Model List'" :folder="'Device'" />
    <b-row>
      <!-- ICON BG -->
      <b-col lg="6" md="6" sm="12">
        <b-card
          class="card-icon-bg card-icon-bg-primary o-hidden mb-30 text-center"
        >
          <i class="i-Tag"></i>
          <div class="content">
            <p class="text-muted mt-2 mb-0">Models</p>
            <p class="inline text-primary text-24 line-height-1 mb-2">{{ this.models.length }}</p>
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
              <i class="nav-icon i-Add mt-3" style="font-size: 20px" id="new-model-section" @click="emptyInput('add')"></i>
              <h5 class="card-title border-bottom p-3 mb-2">New Model</h5>
            </b-row>
            <div class="mt-3" v-show="show">
              <b-row class="ml-3 mt-3 mr-3">
                <b-col md="6">
                  <b-form-input id="input-1" v-model="MName" type="text" required placeholder="Model Name" ></b-form-input>
                </b-col>
                <b-col md="6">
                  <v-select  id="select-1" v-model="MStatus" :options="optionStatuses" required placeholder="Choose Status" 
                   label="text" :reduce="Status => Status.value"></v-select>
                </b-col>
              </b-row>
              <b-row class="ml-3 mt-3 mr-3">
                <b-col md="6">
                  <v-select  id="select-2" v-model="Manufacturer" :options="optionManufacturer" required placeholder="Choose Manufacturer" 
                   label="txtManufacturerName" :reduce="Manufacturer => Manufacturer.id"></v-select>
                </b-col>
                <b-col md="6">
                  <v-select  id="select-3" v-model="Supplier" :options="optionSupplier" required placeholder="Choose Supplier" 
                   label="txtSupplierName" :reduce="Supplier => Supplier.id"></v-select>
                </b-col>
              </b-row>
              <b-row class="ml-3 mr-3 mt-3">
                <b-col md="12">
                  <b-form-textarea id="area-1" v-model="Comment" placeholder="Enter memo ..." rows="3" max-rows="6"></b-form-textarea>
                </b-col>
              </b-row>

                <!-- SELECT ITEMS -->
                <b-row class="ml-3 mr-3 mt-4">
                  <b-col md="12">
                    <h6>Items</h6>
                    <multiselect
                        v-model="selectedItems" placeholder="Choose Items" :custom-label='Item => Item.txtArticlenumber + " // " + Item.txtDescription'
                        track-by="id" :options="items" :multiple="true" :taggable="true" :close-on-select="false"
                        :searchable="true" open-direction="bottom" >
                    </multiselect>
                  </b-col>
                </b-row>

              <!-- NEW MODEL / UPDATE MODEL BUTTONS -->
              <b-row class="ml-3 mt-5 mr-3">
                <b-col md="6" v-if="!updateStatus">
                  <b-button @click="emptyInput" block variant="outline-danger">Delete Input</b-button>
                </b-col>
                <b-col md="6" v-else-if="updateStatus">
                  <b-button @click="emptyInput" block variant="outline-info">Cancel</b-button>
                </b-col>
                <b-col md="6" v-if="!updateStatus">
                  <b-button @click="addModel" block variant="success" :disabled="disabled">Add Model</b-button>
                </b-col>
                <b-col md="6" v-else-if="updateStatus">
                  <b-button @click="updateModel" block variant="warning" :disabled="disabled">Update Model</b-button>
                </b-col>
              </b-row>
              <b-row class="ml-3 mt-3 mr-3">
                <b-col md="12">
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
                id="gridModel"
                :defaultColDef="defaultColDef"
                :columnDefs="columnDefs"
                :rowSelection="rowSelection"
                :rowData="rowData"
                :gridOptions="gridOptions"
                :suppressRowClickSelection="true"
                @cellValueChanged="updateModelGrid"
                :masterDetail="true"
                :detailCellRendererParams="detailCellRendererParams"
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
    title: "Model"
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
      suppliers: [],
      manufacturers: [],
      models: [],
      unknown: [],
      items: [],
      selectedItems: [],
      show: false,
      MName: null,
      MStatus: null,
      Manufacturer: null,
      Supplier: null,
      Comment: null,
      date: null,
      next: null,
      error: false,
      updateStatus: false,
      updateId: null,
      optionSupplier: [],
      optionManufacturer: [],
      optionStatuses: [
        { value: 'Active', text: 'Active' },
        { value: 'Inactive', text: 'Inactive' },
      ],
    };
  },
  beforeMount() {
    this.gridOptions = {};
    this.columnDefs = [
      { headerName: "Model Name", field: "txtModelName", filter: 'agTextColumnFilter', cellRenderer: 'agGroupCellRenderer', },
      { headerName: "Model Status", field: "txtModelStatus", filter: 'agTextColumnFilter', cellEditor: 'agRichSelectCellEditor', cellEditorParams: { cellHeight: 50, values: ['Active', 'Inactive']},},
      { headerName: "Manufacturer", field: "idManufacturer.txtManufacturerName", filter: 'agTextColumnFilter', editable: false },
      { headerName: "Supplier", field: "idSupplier.txtSupplierName", filter: 'agTextColumnFilter', editable: false },
      { headerName: "Memo", field: "txtComment", filter: 'agTextColumnFilter', editable: false },
    ],
    this.detailCellRendererParams = {
      detailGridOptions: {
        rowSelection: 'single',
        suppressRowClickSelection: true,
        enableRangeSelection: true,
        pagination: true,
        paginationAutoPageSize: true,
        columnDefs: [
          {headerName: "Article Number", field: "txtArticlenumber", filter: 'agTextColumnFilter', },
          {headerName: "Item Description", field: "txtDescription", filter: 'agTextColumnFilter', },
          {headerName: "Type", field: "txtType", filter: 'agTextColumnFilter', editable: true, cellEditor: 'agRichSelectCellEditor', 
          cellEditorParams: { cellHeight: 50, values: ['Glass', 'Case', 'Frame Standard', 'Frame Eco', 'Combi']}, },
          {headerName: "Version", field: "txtVersion", filter: 'agTextColumnFilter',},
          {headerName: "Cost", field: "curCost", filter: 'agTextColumnFilter', hide: true,},
          {headerName: "GTIN / EAN", field: "txtGtinEan", filter: 'agTextColumnFilter',},
          {headerName: "Item Group", field: "txtItemGroup", filter: 'agTextColumnFilter',},
          {headerName: "Link", field: "txtLink", filter: 'agTextColumnFilter', editable: false,},
          {headerName: "Memo", field: "txtComment", filter: 'agTextColumnFilter', },
        ],
        defaultColDef: { flex: 1, resizable: true, },
      },
      getDetailRowData: (params) => {
        let el = this.items.filter(e => e.idModel.some(d => d.id == params.data.id))
        params.successCallback(el);
      },
    }
    this.defaultColDef = { flex: 1, editable: true, resizable: true, sortable: true, filter: true, floatingFilter: true, };
    this.rowSelection = 'single';
    this.domLayout = 'autoHeight';
    this.paginationPageSize = 10;
  },
  mounted() {
    if (JSON.parse(localStorage.getItem('model_columnStats')) != null) {
       this.gridOptions.columnApi.setColumnState(JSON.parse(localStorage.getItem('model_columnStats')));
    } else {
      this.gridApi = this.gridOptions.api;
      this.gridColumnApi = this.gridOptions.columnApi;
    }
  },
  computed: {
    disabled: function () {
      return !this.MName ? true : !this.MStatus ? true : !this.Manufacturer ? true : !this.Supplier ? true : false; 
    },
  },
  methods: {
    saveState() {
      localStorage.setItem('model_columnStats', JSON.stringify(this.gridOptions.columnApi.getColumnState()));
    },
    restoreState() {
      localStorage.setItem('model_columnStats', null);
    },
    onBtExport() {
      this.gridApi.exportDataAsExcel({});
    },
    onPageSizeChanged(newPageSize) {
      var value = document.getElementById('page-size').value;
      this.gridApi.paginationSetPageSize(Number(value));
    },
    addModel() {
      let endpoint = `/api/model/`;
      apiService(endpoint, "POST", { txtModelName: this.MName, txtModelStatus: this.MStatus, idManufacturer: this.Manufacturer, idSupplier: this.Supplier, txtComment: this.Comment })
      .then(response => {
        if (response != 'ERROR') {
          console.log(response)
          if(this.selectedItems || this.selectedItems != []) {
            let array = this.selectedItems.map(e => e.id)
            for (let i = 0; i < array.length; i++) {
              let elements = [];
              let endpointItem = `/api/item/${array[i]}/`;
              apiService(endpointItem)
                .then(data => {
                  elements.push(...data.results)
                })
            }
            
          }
          this.getModels();
          this.emptyInput();
        } else {
          this.error = true;
        }
      })
      .catch(err => console.log(err));
    },
    addItemMenu(params) {
      localStorage.setItem('selModel', JSON.stringify(params.node.data))
      this.$router.push('/app/item/item-list/')
    },
    editModelMenu(params) {
      this.emptyInput();
      let sel = params.node.data;
      this.MName = sel.txtModelName;
      this.MStatus = sel.txtModelStatus;
      this.Manufacturer = sel.idManufacturer;
      this.Supplier = sel.idSupplier;
      this.Comment = sel.txtComment;
      this.selectedItems = this.items.filter(e => e.idModel.some(d => d.id == sel.id))
      this.updateStatus = true;
      this.updateId = sel.id;
      this.show = true;
      document.documentElement.scrollTop = 0;
    },
    async updateModel() {
      if(typeof this.Manufacturer == "object") { this.Manufacturer = this.Manufacturer.id } else { this.Manufacturer = this.Manufacturer }
      if(typeof this.Supplier == "object") { this.Supplier = this.Supplier.id } else { this.Supplier = this.Supplier }
      let endpoint = `/api/model/${this.updateId}/`;
      await apiService(endpoint, "PUT", { 
        txtModelName: this.MName,
        txtModelStatus: this.MStatus,
        txtComment: this.Comment,
        idManufacturer: this.Manufacturer,
        idSupplier: this.Supplier })
        .then(response => {
          if (response != 'ERROR'){
            this.emptyInput();
            this.getModels();
          }
        })
        .catch(err => console.log(err));
    },
    async updateModelGrid(event) {     
      let endpoint = `/api/model/${event.node.data.id}/`;
      try {
        await apiService(endpoint, "PATCH", { 
          txtModelName: event.node.data.txtModelName,
          txtModelStatus: event.node.data.txtModelStatus,
          txtComment: event.node.data.txtComment,
        })
      }
      catch (err) {
        console.log(err)
      }
    },
    openModal(params) {
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to delete the selected Model? => " + params.node.data.txtModelName, {
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
        .then(value => { if (value) { this.deleteModel(params); } })
        .catch(err => console.log(err));
    },
    async deleteModel(params) {
      let endpoint = `/api/model/${params.node.data.id}/`;
      await apiService(endpoint, "DELETE")
        .then(response => {
          if (response != 'ERROR') {
            this.getModels();
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
      this.Manufacturer = [];
      this.MName = this.MStatus = this.Comment = null;
      if(event != 'add') {
        this.show = false;
      } else {
        this.updateStatus = false;
        this.show = !this.show;
      }
    },
    getManufacturer() {
      if (!this.error) {
        this.manufacturers = [];
        let endpoint = `/api/manufacturer/`;
        apiService(endpoint)
          .then(data => {
            this.manufacturers.push(...data.results);
            this.optionManufacturer = this.manufacturers
          })
          .catch(err => console.log(err));
      }
    },
    getSupplier() {
      if (!this.error) {
        this.suppliers = [];
        let endpoint = `/api/supplier/`;
        apiService(endpoint)
          .then(data => {
            this.suppliers.push(...data.results);
            this.optionSupplier = this.suppliers;
            this.unknown = this.suppliers.filter(e => e.txtSupplierName == 'UNKNOWN');
            this.Supplier = this.unknown;
          })
          .catch(err => console.log(err));
      }
    },
    getModels() {
      if (!this.error) {
        this.models = [];
        let endpoint = `/api/model-list/`;
        apiService(endpoint)
          .then(data => {
            this.models.push(...data.results);
            this.rowData = this.models
          })
          .catch(err => console.log(err));
      }
    },
    getItems() {
      if (!this.error) {
        this.items = [];
        let endpoint = `/api/item-list/`;
        apiService(endpoint)
          .then(data => { this.items.push(...data.results); })
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
          name: 'Edit Model',
          action: () => this.editModelMenu(params)
        },
        'separator',
        {
          name: 'Add Item to Model',
          action: () => this.addItemMenu(params)
        },
        'separator',
        {
          name: 'Delete Model',
          action: () =>  this.openModal(params)
        },
        'export'
      ];
      return result;
    },
  },
  created() {
    this.getManufacturer();
    this.getSupplier();
    this.getModels();
    this.getDateToday();
    this.getItems();
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
  #new-model-section {
    cursor: pointer;
    outline: none;
  }
</style>
