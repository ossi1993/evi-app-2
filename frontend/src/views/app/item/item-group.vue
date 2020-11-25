<template>
  <!-- ============ Body content start ============= -->
  <div class="main-content">
    <breadcumb :page="'Item Group'" :folder="'Item'" />
    <!-- ICON BG -->
    <b-row>
      <b-col lg="6" md="6" sm="12">
        <b-card class="card-icon-bg card-icon-bg-primary o-hidden mb-30 text-center">
          <i class="i-Check"></i>
          <div class="content">
            <p class="text-muted mt-2 mb-0">Item Group</p>
            <p class="inline text-primary text-24 line-height-1 mb-2">{{ this.itemGroups.length }}</p>
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

    <!-- ######################################### -->
    <!-- ########### ITEM GROUP SECTION ########## -->
    <!-- ######################################### -->
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0 mb-3">
            <b-row class="ml-3">
              <i class="nav-icon i-Add mt-3" style="font-size: 20px" id="new-attribute-section" @click="emptyInput('add')"></i>
              <h5 class="card-title border-bottom p-3 mb-2">New Item Group</h5>
            </b-row>
            <div class="ml-3 mr-3" v-show="show">
              <b-row class="ml-3 mr-3 mt-3">
                <b-col md="6">
                  <v-select  id="select-1" v-model="selectedItemType" :options="itemTypes" label="txtItemType" placeholder="Choose Item Type" 
                  :reduce="ItemType => ItemType.id"></v-select>
                </b-col>
                <b-col md="6">
                  <b-form-input id="input-1" v-model="ItemGroup" type="text" placeholder="Item Group" ></b-form-input>
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
                  <b-button @click="addItemGroup" block variant="success" :disabled="disabled">Add Item Group</b-button>
                </b-col>
                <b-col md="6" v-else-if="updateStatus">
                  <b-button @click="updateItemGroup" block variant="warning" :disabled="disabled">Update Item Group</b-button>
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

    <!-- AG-GRID ITEM GROUPS -->
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0">
            <AgGridVue class="ag-theme-alpine"
                id="gridItemGroup"
                :defaultColDef="defaultColDef"
                :columnDefs="columnDefs"
                :rowSelection="rowSelection"
                :rowData="rowData"
                :gridOptions="gridOptions"
                :suppressRowClickSelection="true"
                @cellValueChanged="updateItemGroupGrid"
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
    title: "Item Group"
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
      itemGroups: [],
      itemTypes: [],
      ItemGroup: null,
      selectedItemType: null,
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
      {headerName: "Item Group", field: "txtItemGroup", filter: 'agTextColumnFilter', },
      {headerName: "Item Type", field: "idItemType.txtItemType", filter: 'agTextColumnFilter', editable: false, },
    ]
  },
  mounted() {
    if (JSON.parse(localStorage.getItem('itemGroup_columnStats')) != null) {
       this.gridOptions.columnApi.setColumnState(JSON.parse(localStorage.getItem('itemGroup_columnStats')));
    } else {
      this.gridApi = this.gridOptions.api;
      this.gridColumnApi = this.gridOptions.columnApi;
    }
  },
  computed: {
    disabled: function () {
      return !this.selectedItemType ? true : !this.ItemGroup ? true : false; 
    },
  },
  methods: {
    saveState() {
      localStorage.setItem('itemGroup_columnStats', JSON.stringify(this.gridOptions.columnApi.getColumnState()));
    },
    restoreState() {
      localStorage.setItem('itemGroup_columnStats', null);
    },
    onBtExport() {
      this.gridApi.exportDataAsExcel({});
    },
    onPageSizeChanged(newPageSize) {
      var value = document.getElementById('page-size').value;
      this.gridApi.paginationSetPageSize(Number(value));
    },
    addItemGroup() {
      let endpoint = `/api/item-group/`;
      apiService(endpoint, "POST", { 
        idItemType: this.selectedItemType,
        txtItemGroup: this.ItemGroup,
        })
        .then(response => {
          if (response != 'ERROR'){
            this.getItemGroups();
            this.emptyInput();
          }
        })
        .catch(err => console.log(err));
    },
    editItemGroupMenu(params) {
      this.emptyInput();
      let sel = params.node.data;
      this.selectedItemType = sel.idItemType;
      this.ItemGroup = sel.txtItemGroup;
      this.updateStatus = true;
      this.updateId = sel.id;
      this.show = true;
      document.documentElement.scrollTop = 0;
    },
    async updateItemGroup() {
      let endpoint = `/api/item-group/${this.updateId}/`;
      await apiService(endpoint, "PATCH", { 
        idItemType: this.selectedItemType.id,
        txtItemGroup: this.ItemGroup,
        })
        .then(response => {
          if (response != 'ERROR'){
            this.emptyInput();
            this.getItemGroups();
          }
        })
        .catch(err => console.log(err));
    },
    async updateItemGroupGrid(event) {     
      let endpoint = `/api/item-group/${event.node.data.id}/`;
      try {
        await apiService(endpoint, "PATCH", { txtItemGroup: event.node.data.txtItemGroup, })
        .catch(err => console.log(err));
      }
      catch (err) {
        console.log(err)
      }
    },
    openModal(params) {
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to delete the selected Item Group?", {
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
        .then(value => { if (value) { this.deleteItemGroup(params); } })
        .catch(err => console.log(err));
    },
    async deleteItemGroup(params) {
      let endpoint = `/api/item-group/${params.node.data.id}/`;
      await apiService(endpoint, "DELETE")
        .then(response => {
          if (response != 'ERROR') {
            this.getItemGroups();
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
      this.selectedItemType = this.ItemGroup = null;
      if(event != 'add') {
        this.show = false;
      } else {
        this.updateStatus = false;
        this.show = !this.show;
      }
    },
    getItemGroups() {
      if (!this.error) {
        this.itemGroups = [];
        let endpoint = `/api/item-group-list/`;
        apiService(endpoint)
          .then(data => {
            this.itemGroups.push(...data.results);
            this.rowData = this.itemGroups
          })
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
          name: 'Edit Item Group',
          action: () => this.editItemGroupMenu(params)
        },
        'separator',
        {
          name: 'Delete Item Group',
          action: () =>  this.openModal(params)
        },
        'export'
      ];
      return result;
    },
  },
  created() {
    this.getDateToday();
    this.getItemGroups();
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
