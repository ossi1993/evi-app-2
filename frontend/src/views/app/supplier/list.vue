<template>
  <!-- ============ Body content start ============= -->
  <div class="main-content">
    <breadcumb :page="'List'" :folder="'Supplier'" />
    <b-row>
      <!-- ICON BG -->
      <b-col lg="6" md="6" sm="12">
        <b-card class="card-icon-bg card-icon-bg-primary o-hidden mb-30 text-center">
          <i class="i-Truck"></i>
          <div class="content">
            <p class="text-muted mt-2 mb-0">Supplier</p>
            <p class="inline text-primary text-24 line-height-1 mb-2">{{ this.suppliers.length }}</p>
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

    <!-- ####################################### -->
    <!-- ########### SUPPLIER SECTION ########## -->
    <!-- ####################################### -->
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0 mb-3">
            <b-row class="ml-3">
              <i class="nav-icon i-Add mt-3" style="font-size: 20px" @click="emptyInput('add')" id="new-supplier-section"></i>
              <h5 class="card-title border-bottom p-3 mb-2">New Supplier</h5>
            </b-row>
            <div class="mt-3" v-show="show">
              <b-form @submit.prevent="onSubmit">
                <b-row class="ml-3 mr-3">
                  <b-col md="12" class="mt-3">
                    <b-form-input id="input-1" v-model="SName" type="text" required placeholder="Supplier Name" ></b-form-input>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3">
                  <b-col md="4" class="mt-3">
                    <b-form-input id="input-3" v-model="Street1" type="text" placeholder="Street 1" ></b-form-input>
                  </b-col>
                  <b-col md="4" class="mt-3">
                    <b-form-input id="input-4" v-model="Street2" type="text" placeholder="Street 2" ></b-form-input>
                  </b-col>
                  <b-col md="4" class="mt-3">
                    <b-form-input id="input-5" v-model="Street3" type="text" placeholder="Street 3" ></b-form-input>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3">
                  <b-col md="2" class="mt-3">
                    <b-form-input id="input-6" v-model="Zip" type="text" placeholder="ZIP" ></b-form-input>
                  </b-col>
                  <b-col md="2" class="mt-3">
                    <b-form-input id="input-7" v-model="City" type="text" placeholder="City" ></b-form-input>
                  </b-col>
                  <b-col md="4" class="mt-3">
                    <b-form-input id="input-8" v-model="Province" type="text" placeholder="Province" ></b-form-input>
                  </b-col>
                  <b-col md="4" class="mt-3">
                    <b-form-input id="input-9" v-model="Land" type="text" required placeholder="Land" ></b-form-input>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3">
                  <b-col md="4" class="mt-3">
                    <b-form-input v-model="CPerson" type="text" placeholder="Contact Person" ></b-form-input>
                  </b-col>
                  <b-col md="4" class="mt-3">
                    <b-form-input v-model="Phone" type="text" placeholder="Phone" ></b-form-input>
                  </b-col>
                  <b-col md="4" class="mt-3">
                    <b-form-input v-model="Mail" type="text" placeholder="E-Mail" ></b-form-input>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3">
                  <b-col md="4" class="mt-3">
                    <b-form-input v-model="Skype" type="text" placeholder="Skype" ></b-form-input>
                  </b-col>
                  <b-col md="4" class="mt-3">
                    <b-form-input v-model="WhatsApp" type="text" placeholder="WhatsApp" ></b-form-input>
                  </b-col>
                  <b-col md="4" class="mt-3">
                    <b-form-input v-model="WeChat" type="text" placeholder="WeChat" ></b-form-input>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3">
                  <b-col md="12" class="mt-3">
                    <multiselect
                        v-model="selectedItemTypes" tag-placeholder="Choose Supplier Type" placeholder="Choose Supplier Type" label="txtItemType"
                        track-by="id" :options="itemTypes" :multiple="true" :taggable="true" :close-on-select="false"
                        :searchable="true" open-direction="bottom">
                    </multiselect>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="12">
                    <b-form-textarea v-model="Comment" placeholder="Enter memo ..." rows="3" max-rows="6"></b-form-textarea>
                  </b-col>
                </b-row>
                
                <!-- NEW SUPPLIER / UPDATE SUPPLIER BUTTONS -->
                <b-row class="ml-3 mt-5 mr-3">
                  <b-col md="6" v-if="!updateStatus">
                    <b-button @click="emptyInput" block variant="outline-danger">Delete Input</b-button>
                  </b-col>
                  <b-col md="6" v-else-if="updateStatus">
                    <b-button @click="emptyInput" block variant="outline-info">Cancel</b-button>
                  </b-col>
                  <b-col md="6" v-if="!updateStatus">
                    <b-button type="submit" block variant="success" :disabled="disabled">Add Supplier</b-button>
                  </b-col>
                  <b-col md="6" v-else-if="updateStatus">
                    <b-button type="submit" block variant="warning" :disabled="disabled">Update Supplier</b-button>
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

    <!-- AG-GRID SUPPLIER -->
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0">
            <AgGridVue class="ag-theme-alpine"
                id="gridSupplier"
                :defaultColDef="defaultColDef"
                :columnDefs="columnDefs"
                :rowSelection="rowSelection"
                :rowData="rowData"
                :gridOptions="gridOptions"
                :suppressRowClickSelection="true"
                :excelStyles="excelStyles"
                @cellValueChanged="updateSupplierGrid"
                @row-selected="onRowSelected"
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
    title: "Supplier"
  },
  components: {
    AgGridVue
  },
  data() {
    return {
      // AG-GRID VARIABLES
      gridOptions: null,
      gridApi: null,
      gridColumnApi: null,
      columnApi: null,
      columnDefs: null,
      rowData: null,
      rowSelection: null,
      defaultColDef: null,
      excelStyles: null,
      frameworkComponents: null,
      detailCellRendererParams: null,
      domLayout: null,
      modules: AllModules,

      // VUE VARIABLES
      suppliers: [],
      itemTypes: [],
      selectedItemTypes: [],

      SName: null,
      SType: null,
      Street1: null,
      Street2: null,
      Street3: null,
      Zip: null,
      City: null,
      Province: null,
      Land: null,
      CPerson: null,
      Phone: null,
      Mail: null,
      Skype: null,
      WhatsApp: null,
      WeChat: null,
      Comment: null,
      date: null,
      error: false,
      show: false,
      updateStatus: false,
      updateId: null,
    };
  },
  beforeMount() {
    this.gridOptions = {};
    this.columnDefs = [
      {headerName: "Supplier Name", field: "txtSupplierName", filter: 'agTextColumnFilter', cellRenderer: 'agGroupCellRenderer',},
      {headerName: "Street 1", field: "txtStreet1", filter: 'agTextColumnFilter',},
      {headerName: "Street 2", field: "txtStreet2", filter: 'agTextColumnFilter',},
      {headerName: "Street 3", field: "txtStreet3", filter: 'agTextColumnFilter',},
      {headerName: "ZIP", field: "txtZip", filter: 'agTextColumnFilter',},
      {headerName: "City", field: "txtCity", filter: 'agTextColumnFilter',},
      {headerName: "Province", field: "txtProvince", filter: 'agTextColumnFilter',},
      {headerName: "Land", field: "txtLand", filter: 'agTextColumnFilter',},
      {headerName: "Contact Person", field: "txtContactPerson", filter: 'agTextColumnFilter',},
      {headerName: "Phone", field: "txtCpPhone", filter: 'agTextColumnFilter',},
      {headerName: "E-Mail", field: "txtCpMail", filter: 'agTextColumnFilter',},
      {headerName: "Skype", field: "txtCpSkype", filter: 'agTextColumnFilter',},
      {headerName: "WhatsApp", field: "txtCpWhatsApp", filter: 'agTextColumnFilter',},
      {headerName: "WeChat", field: "txtCpWeChat", filter: 'agTextColumnFilter',},
      {headerName: "Memo", field: "txtComment", filter: 'agTextColumnFilter',},
    ],
    this.defaultColDef = { editable: true, resizable: true, sortable: true, filter: true, floatingFilter: true, minWidth: 100, };
    this.rowSelection = 'single';
    this.domLayout = 'autoHeight';
    this.paginationPageSize = 10;
    this.detailCellRendererParams = {
      detailGridOptions: {
        rowSelection: 'single',
        suppressRowClickSelection: true,
        enableRangeSelection: true,
        pagination: true,
        paginationAutoPageSize: true,
        columnDefs: [ { field: 'txtItemType', headerName: 'Item Type' }, ],
        defaultColDef: { flex: 1, resizable: true, editable: false, },
      },
      getDetailRowData: (params) => {
        params.successCallback(params.data.idItemType);
      },
    }
  },
  mounted() {
    if (JSON.parse(localStorage.getItem('supplier_columnStats')) != null) {
       this.gridOptions.columnApi.setColumnState(JSON.parse(localStorage.getItem('supplier_columnStats')));
    } else {
      this.gridApi = this.gridOptions.api;
      this.gridColumnApi = this.gridOptions.columnApi;
    }
  },
  computed: {
    disabled: function () {
      return !this.Land ? true : !this.SName ? true : false;
    },
  },
  methods: {
    saveState() {
      localStorage.setItem('supplier_columnStats', JSON.stringify(this.gridOptions.columnApi.getColumnState()));
    },
    restoreState() {
      localStorage.setItem('supplier_columnStats', null);
    },
    onBtExport() {
      this.gridApi.exportDataAsExcel({});
    },
    onSubmit() {
      if(!this.updateStatus) { this.addSup();
      } else { this.updateSupplier(); }
    },
    onPageSizeChanged(newPageSize) {
      var value = document.getElementById('page-size').value;
      this.gridApi.paginationSetPageSize(Number(value));
    },
    onRowSelected(event) {
      this.show = this.show ? false : true
    },
    addSup() {
      let endpoint = `/api/supplier/`;
      apiService(endpoint, "POST", { 
        txtSupplierName: this.SName,
        txtStreet1: this.Street1,
        txtStreet2: this.Street2,
        txtStreet3: this.Street3,
        txtZip: this.Zip,
        txtCity: this.City,
        txtProvince: this.Province,
        txtLand: this.Land,
        txtContactPerson: this.CPerson,
        txtCpPhone: this.Phone,
        txtCpMail: this.Mail,
        txtCpSkype: this.Skype,
        txtCpWhatsApp: this.WhatsApp,
        txtCpWeChat: this.WeChat,
        idItemType: this.selectedItemTypes.map(e => e.id),
        txtComment: this.Comment,
        })
        .then(response => {
          if (response != 'ERROR') {
            this.getSupplier();
            this.emptyInput()
          }
        })
        .catch(err => console.log(err));
    },
    editSupplierMenu(params) {
      this.emptyInput();
      let sel = params.node.data;
      this.SName = sel.txtSupplierName;
      this.Street1 = sel.txtStreet1;
      this.Street2 = sel.txtStreet2;
      this.Street3 = sel.txtStreet3;
      this.Zip = sel.txtZip;
      this.City = sel.txtCity;
      this.Province = sel.txtProvince;
      this.Land = sel.txtLand;
      this.CPerson = sel.txtContactPerson;
      this.Phone = sel.txtCpPhone;
      this.Mail = sel.txtCpMail;
      this.Skype = sel.txtCpSkype;
      this.WhatsApp = sel.txtCpWhatsApp;
      this.WeChat = sel.txtCpWeChat;
      this.selectedItemTypes = sel.idItemType;
      this.Comment = sel.txtComment;
      this.updateStatus = true;
      this.updateId = sel.id;
      this.show = true;
      document.documentElement.scrollTop = 0;
    },
    async updateSupplier() {
      let endpoint = `/api/supplier/${this.updateId}/`;
      await apiService(endpoint, "PATCH", { 
        txtSupplierName: this.SName,
        txtStreet1: this.Street1,
        txtStreet2: this.Street2,
        txtStreet3: this.Street3,
        txtZip: this.Zip,
        txtCity: this.City,
        txtProvince: this.Province,
        txtLand: this.Land,
        txtContactPerson: this.CPerson,
        txtCpPhone: this.Phone,
        txtCpMail: this.Mail,
        txtCpSkype: this.Skype,
        txtCpWhatsApp: this.WhatsApp,
        txtCpWeChat: this.WeChat,
        idItemType: this.selectedItemTypes.map(e => e.id),
        txtComment: this.Comment, })
        .then(response => {
          if (response != 'ERROR'){
            this.emptyInput();
            this.getSupplier();
          }
        })
        .catch(err => console.log(err));
    },
    async updateSupplierGrid(event) {     
      let endpoint = `/api/supplier/${event.node.data.id}/`;
      try {
        await apiService(endpoint, "PATCH", { 
          txtSupplierName: event.node.data.txtSupplierName,
          txtStreet1: event.node.data.txtStreet1,
          txtStreet2: event.node.data.txtStreet2,
          txtStreet3: event.node.data.txtStreet3,
          txtZip: event.node.data.txtZip,
          txtCity: event.node.data.txtCity,
          txtProvince: event.node.data.txtProvince,
          txtLand: event.node.data.txtLand,
          txtContactPerson: event.node.data.txtContactPerson,
          txtCpPhone: event.node.data.txtCpPhone,
          txtCpMail: event.node.data.txtCpMail,
          txtCpSkype: event.node.data.txtCpSkype,
          txtCpWhatsApp: event.node.data.txtCpWhatsApp,
          txtCpWeChat: event.node.data.txtCpWeChat,
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
        .msgBoxConfirm("Are you sure you want to delete the selected Supplier? => " + params.node.data.txtSupplierName, {
          title: "Please Confirm", size: "m", buttonSize: "sm", okVariant: "danger", okTitle: "YES",
          cancelTitle: "NO", footerClass: "p-2", hideHeaderClose: false, centered: true
        })
        .then(value => { if (value) { this.deleteSup(params); } })
        .catch(err => console.log(err));
    },
    async deleteSup(params) {
      let endpoint = `/api/supplier/${params.node.data.id}/`;
      await apiService(endpoint, "DELETE")
        .then(response => {
          if (response != 'ERROR') {
            this.getSupplier();
          } else {
            this.$bvToast.toast(`Can't delete this entry. Please check if there are dependent entries. Please delete those first!`, {
              title: 'DELETE WARNING', variant: 'danger', autoHideDelay: 6000, appendToast: false
            })
          }
        })
    },
    emptyInput(event) {
      this.selectedItemTypes = [];
      this.SName = this.Street1 = this.Street2 = this.Street3 = this.Zip = this.City = this.Province = null;
      this.Land = this.CPerson = this.Phone = this.Mail = this.Skype = this.WhatsApp = this.WeChat = this.Comment = null;
      if(event != 'add') {
        this.show = false;
      } else {
        this.updateStatus = false;
        this.show = !this.show;
      }
    },
    getSupplier() {
      if (!this.error) {
        this.suppliers = [];
        let endpoint = `/api/supplier-list/`;
        apiService(endpoint)
          .then(data => {
            this.suppliers.push(...data.results);
            this.rowData = this.suppliers
          })
          .catch(err => console.log(err));
      }
    },
    getItemTypes() {
      if (!this.error) {
        this.itemTypes = [];
        let endpoint = `/api/item-type/`;
        apiService(endpoint)
          .then(data => {
            this.itemTypes.push(...data.results);
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
          name: 'Edit Supplier',
          action: () => this.editSupplierMenu(params)
        },
        'separator',
        {
          name: 'Delete Supplier',
          action: () => this.openModal(params)
        },
        'export'
      ];
      return result;
    },
  },
  created() {
    this.getSupplier();
    this.getDateToday();
    this.getItemTypes();    
  },
};
</script>
<style scoped>
  i:focus,
  input:focus,
  select:focus,
  textarea:focus,
  button:focus {
      outline: none;
  }
  #new-supplier-section {
    cursor: pointer;
    outline: none;
  }
</style>
