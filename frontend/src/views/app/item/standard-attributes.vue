<template>
  <!-- ============ Body content start ============= -->
  <div class="main-content">
    <breadcumb :page="'Standard Attributes'" :folder="'Item'" />
    <!-- ICON BG -->
    <b-row>
      <b-col lg="6" md="6" sm="12">
        <b-card class="card-icon-bg card-icon-bg-primary o-hidden mb-30 text-center">
          <i class="i-Check"></i>
          <div class="content">
            <p class="text-muted mt-2 mb-0">Standard</p>
            <p class="inline text-primary text-24 line-height-1 mb-2">{{ this.values.length }}</p>
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

    <!-- ################################################# -->
    <!-- ########### STANDARD ATTRIBUTE SECTION ########## -->
    <!-- ################################################# -->
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0 mb-3">
            <b-row class="ml-3">
              <i class="nav-icon i-Add mt-3" style="font-size: 20px" id="new-attribute-section" @click="emptyInput('add')"></i>
              <h5 class="card-title border-bottom p-3 mb-2">New Standard Attribute</h5>
            </b-row>
            <div class="ml-3 mr-3" v-show="show">
              <b-form @submit.prevent="onSubmit">
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="6">
                    <v-select v-model="KeyAttribute" :options="keyAttributes" label="txtNameAttribute" placeholder="Choose Attribute" 
                    :reduce="KeyAttribute => KeyAttribute.txtKeyAttribute"></v-select>
                  </b-col>
                  <b-col md="6">
                    <v-select v-model="ItemType" :options="itemTypes" placeholder="Choose Item Type" label="txtItemType"></v-select>
                  </b-col>
                </b-row>
                <!-- NEW STANDARD ATTRIBUTE / UPDATE STANDARD ATTRIBUTE BUTTONS -->
                <b-row class="ml-3 mr-3 mt-5">
                  <b-col md="6" v-if="!updateStatus">
                    <b-button @click="emptyInput" block variant="outline-danger">Delete Input</b-button>
                  </b-col>
                  <b-col md="6" v-else-if="updateStatus">
                    <b-button @click="emptyInput" block variant="outline-info">Cancel</b-button>
                  </b-col>
                  <b-col md="6" v-if="!updateStatus">
                    <b-button type="submit" block variant="success" :disabled="disabled">Add Standard Attribute</b-button>
                  </b-col>
                  <b-col md="6" v-else-if="updateStatus">
                    <b-button type="submit" block variant="warning" :disabled="disabled">Update Standard Attribute</b-button>
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

    <!-- AG-GRID STANDARD -->
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0">
            <AgGridVue class="ag-theme-alpine"
                id="gridStandard"
                :defaultColDef="defaultColDef"
                :columnDefs="columnDefs"
                :rowSelection="rowSelection"
                :rowData="rowData"
                :gridOptions="gridOptions"
                :suppressRowClickSelection="true"
                @cellValueChanged="updateStandardGrid"
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
    title: "Standard Attributes"
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
      values: [],
      keyAttributes: [],
      itemTypes: [],

      ItemType: null,
      KeyAttribute: null,
      Standard: null,
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
      {headerName: "Key Attribute", field: "idKeyAttribute.txtKeyAttribute", filter: 'agTextColumnFilter',},
      {headerName: "Name Attribute", field: "idKeyAttribute.txtNameAttribute", filter: 'agTextColumnFilter',},
      {headerName: "Item Type", field: "idItemType.txtItemType", filter: 'agTextColumnFilter', },
    ]
  },
  mounted() {
    if (JSON.parse(localStorage.getItem('standardAttributes_columnStats')) != null) {
       this.gridOptions.columnApi.setColumnState(JSON.parse(localStorage.getItem('standardAttributes_columnStats')));
    } else {
      this.gridApi = this.gridOptions.api;
      this.gridColumnApi = this.gridOptions.columnApi;
    }
  },
  computed: {
    disabled: function () {
      return !this.KeyAttribute ? true : !this.ItemType ? true : false; 
    },
  },
  methods: {
    saveState() {
      localStorage.setItem('standardAttributes_columnStats', JSON.stringify(this.gridOptions.columnApi.getColumnState()));
    },
    restoreState() {
      localStorage.setItem('standardAttributes_columnStats', null);
    },
    onSubmit() {
      if(!this.updateStatus) { this.addStandard();
      } else { this.updateStandard(); }
    },
    onBtExport() {
      this.gridApi.exportDataAsExcel({});
    },
    onPageSizeChanged(newPageSize) {
      var value = document.getElementById('page-size').value;
      this.gridApi.paginationSetPageSize(Number(value));
    },
    addStandard() {
      let endpoint = `/api/standard-attribute/`;
      apiService(endpoint, "POST", { 
        idKeyAttribute: this.KeyAttribute,
        idItemType: this.ItemType.id,
        })
        .then(response => {
          if (response != 'ERROR'){
            this.getAttributes();
            this.emptyInput();
          }
        })
        .catch(err => console.log(err));
    },
    editStandardMenu(params) {
      this.emptyInput();
      let sel = params.node.data;
      this.KeyAttribute = sel.idKeyAttribute;
      this.ItemType = sel.idItemType;
      this.updateStatus = true;
      this.updateId = sel.id;
      this.show = true;
      document.documentElement.scrollTop = 0;
    },
    async updateStandard() {
      let endpoint = `/api/standard-attribute/${this.updateId}/`;
      await apiService(endpoint, "PUT", { 
        idKeyAttribute: this.KeyAttribute.txtKeyAttribute,
        idItemType: this.ItemType.id,
        })
        .then(response => {
          if (response != 'ERROR'){
            this.emptyInput();
            this.getAttributes();
          }
        })
        .catch(err => console.log(err));
    },
    async updateStandardGrid(event) {     
      let endpoint = `/api/standard-attribute/${event.node.data.id}/`;
      try {
        await apiService(endpoint, "PATCH", { 
          idKeyAttribute: event.node.data.idKeyAttribute,
          blnStandard: event.node.data.blnStandard,
          txtItemType: event.node.data.txtItemType,
        })
        .catch(err => console.log(err));
      }
      catch (err) {
        console.log(err)
      }
    },
    openModal(params) {
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to delete the selected Standard Value?", {
          title: "Please Confirm", size: "m", buttonSize: "sm", okVariant: "danger", okTitle: "YES",
          cancelTitle: "NO", footerClass: "p-2", hideHeaderClose: false, centered: true })
        .then(value => { if (value) { this.deleteStandardAttribute(params); } })
        .catch(err => console.log(err));
    },
    async deleteStandardAttribute(params) {
      let endpoint = `/api/standard-attribute/${params.node.data.id}/`;
      await apiService(endpoint, "DELETE")
        .then(response => {
          if (response != 'ERROR') {
            this.getAttributes();
          } else {
            this.$bvToast.toast(`Can't delete this entry. Please check if there are dependent entries. Please delete those first!`, {
              title: 'DELETE WARNING', variant: 'danger', autoHideDelay: 6000, appendToast: false
            })
          }
        })
    },
    emptyInput(event) {
      this.KeyAttribute = this.ItemType = this.Standard = null;
      if(event != 'add') {
        this.show = false;
      } else {
        this.updateStatus = false;
        this.show = !this.show;
      }
    },
    getAttributes() {
      if (!this.error) {
        this.values = [];
        let endpoint = `/api/standard-attribute-list/`;
        apiService(endpoint)
          .then(data => {
            this.values.push(...data.results);
            this.rowData = this.values
          })
          .catch(err => console.log(err));
      }
    },
    getItemAttributes() {
      if (!this.error) {
        this.keyAttributes = [];
        let endpoint = `/api/item-template-attribute/`;
        apiService(endpoint)
          .then(data => { this.keyAttributes.push(...data.results); })
          .catch(err => console.log(err));
      }
    },
    getItemTypes() {
      if (!this.error) {
        this.itemTypes = [];
        let endpoint = `/api/item-type/`;
        apiService(endpoint)
          .then(data => { this.itemTypes.push(...data.results); })
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
          name: 'Edit Standard Attribute',
          action: () => this.editStandardMenu(params)
        },
        'separator',
        {
          name: 'Delete Standard Attribute',
          action: () =>  this.openModal(params)
        },
        'export'
      ];
      return result;
    },
  },
  created() {
    this.getDateToday();
    this.getAttributes();
    this.getItemAttributes();
    this.getItemTypes();
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
