<template>
  <!-- ============ Body content start ============= -->
  <div class="main-content">
    <breadcumb :page="'List'" :folder="'Manufacturer'" />
    <b-row>
      <!-- ICON BG -->
      <b-col lg="6" md="6" sm="12">
        <b-card
          class="card-icon-bg card-icon-bg-primary o-hidden mb-30 text-center"
        >
          <i class="i-Add-User"></i>
          <div class="content">
            <p class="text-muted mt-2 mb-0">Manufacturer</p>
            <p class="inline text-primary text-24 line-height-1 mb-2">{{ this.manufacturers.length }}</p>
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
              <i class="nav-icon i-Add mt-3" style="font-size: 20px" id="new-manufacturer-section" @click="emptyInput('add')"></i>
              <h5 class="card-title border-bottom p-3 mb-2">New Manufacturer</h5>
            </b-row>
            <div class="ml-3 mr-3" v-show="show">
              <b-form>
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="12">
                    <b-form-input id="input-1" v-model="ManName" type="text" required placeholder="Manufacturer Name" ></b-form-input>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="12">
                    <b-form-textarea id="area-1" v-model="Comment" placeholder="Enter memo ..." rows="3" max-rows="6"></b-form-textarea>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-5">
                  <b-col md="6">
                    <b-button @click="emptyInput" block variant="outline-danger" >Delete Input</b-button>
                  </b-col>
                  <b-col md="6">
                    <b-button @click="addMan" block variant="success" :disabled="!ManName">Add Manufacturer</b-button>
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
                id="gridItems"
                :defaultColDef="defaultColDef"
                :columnDefs="columnDefs"
                :rowSelection="rowSelection"
                :rowData="rowData"
                :gridOptions="gridOptions"
                :suppressRowClickSelection="true"
                :excelStyles="excelStyles"
                @cellValueChanged="updateManufacturerGrid"
                @row-selected="onRowSelected"
                :getContextMenuItems="getContextMenu"
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
                <b-button @click="onBtExport" class="ml-3" size="sm" variant="outline-success">Export Excel</b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ============ Body content End ============= -->

</template>
<script>
import { apiService } from "@/common/api.service.js";
import { AgGridVue } from '@ag-grid-community/vue';
import { AllModules } from '@ag-grid-enterprise/all-modules';

export default {
  metaInfo: {    
    title: "Manufacturer"
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
      manufacturers: [],
      show: false,
      ManName: null,
      Comment: null,
      date: null,
      error: false,
    };
  },
  beforeMount() {
    this.gridOptions = {};
    this.columnDefs = [ 
      {headerName: "Manufacturer", field: "txtManufacturerName", filter: 'agTextColumnFilter', }, 
      {headerName: "Memo", field: "txtComment", filter: 'agTextColumnFilter', }, 
      ],
    this.defaultColDef = { flex: 1, editable: true, resizable: true, sortable: true, filter: true, floatingFilter: true, };
    this.rowSelection = 'single';
    this.domLayout = 'autoHeight';
    this.paginationPageSize = 10;
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  },
  methods: {
    onBtExport() {
      this.gridApi.exportDataAsExcel({});
    },
    onPageSizeChanged(newPageSize) {
      var value = document.getElementById('page-size').value;
      this.gridApi.paginationSetPageSize(Number(value));
    },
    onRowSelected(event) {
      this.show = this.show ? false : true
    },
    addMan() {
      if (this.ManName) {
        let endpoint = `/api/manufacturer/`;
        apiService(endpoint, "POST", { 
          txtManufacturerName: this.ManName, 
          txtComment: this.Comment, 
          })
          .then(response => {
            if (response != 'ERROR'){
              this.getMan();
              this.emptyInput()
            } else {
              this.error = true;
            }
          })
        if (this.error) {
          this.error = false;
        }
      }
    },
    async updateManufacturerGrid(event) {     
      let endpoint = `/api/manufacturer/${event.node.data.id}/`;
      try {
        await apiService(endpoint, "PATCH", { 
          txtManufacturerName: event.node.data.txtManufacturerName,
        })
        .catch(err => console.log(err));
      }
      catch (err) {
        console.log(err)
      }
    },
    openModal(params) {
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to delete the selected Manufacturer? => " + params.node.data.txtManufacturerName, {
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
            this.deleteMan(params);
          }
        })
        .catch(err => console.log(err));
    },
    async deleteMan(params) {
      let endpoint = `/api/manufacturer/${params.node.data.id}/`;
      await apiService(endpoint, "DELETE")
        .then(response => {
          if (response != 'ERROR') {
            this.getMan();
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
      this.ManName = this.Comment = null;
      if(event != 'add') {
        this.show = false;
      } else {
        this.show = !this.show;
      }
    },
    getMan() {
      if (!this.error) {
        this.manufacturers = [];
        let endpoint = `/api/manufacturer/`;
        apiService(endpoint)
          .then(data => {
            this.manufacturers.push(...data.results);
            this.rowData = this.manufacturers
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
          name: 'Delete Manufacturer',
          action: () => this.openModal(params)
        },
        'separator',
        'export'
      ];
      return result;
    },
  },
  created() {
    this.getMan();
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
  #new-manufacturer-section {
    cursor: pointer;
    outline: none;
  }
</style>
