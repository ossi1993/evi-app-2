<template>
  <!-- ============ Body content start ============= -->
  <div class="main-content">
    <breadcumb :page="'Sample'" :folder="'Inspection'" />
    <b-row>
      <!-- ICON BG -->
      <b-col lg="6" md="6" sm="12">
        <b-card
          class="card-icon-bg card-icon-bg-primary o-hidden mb-30 text-center"
        >
          <i class="i-File"></i>
          <div class="content">
            <p class="text-muted mt-2 mb-0">Samples</p>
            <p class="inline text-primary text-24 line-height-1 mb-2">{{ this.templates.length }}</p>
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
  </div>
  <!-- ============ Body content End ============= -->
</template>

<script>
import { apiService } from "@/common/api.service.js";
import { AgGridVue } from '@ag-grid-community/vue';
import { AllModules } from '@ag-grid-enterprise/all-modules';

export default {
  metaInfo: {    
    title: "Samples"
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
      templates: [],
      show: false,
      visible: false,
      date: null,
      next: null,
      error: false,
    };
  },
  beforeMount() {
    this.gridOptions = {};
    this.columnDefs = [
      {headerName: "Model Name", field: "txtModelName", filter: 'agTextColumnFilter', checkboxSelection: true,},
      {headerName: "Status", field: "txtSampleStatus", filter: 'agTextColumnFilter', },
      {headerName: "Memo", field: "txtComment", filter: 'agTextColumnFilter', },
      {headerName: "Manufacturer", field: "idManufacturer.txtManufacturerName", filter: 'agTextColumnFilter', },
      {headerName: "Supplier", field: "idSupplier.txtSupplierName", filter: 'agTextColumnFilter', },
    ],
    this.defaultColDef = {editable: false, resizable: true, sortable: true, filter: true, floatingFilter: true,};
    this.rowSelection = 'single';
    this.domLayout = 'autoHeight';
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  },
  methods: {
    onRowSelected(event) {
      this.show = this.show ? false : true
    },
    onGridReady(params) { 
    },
    getTemplates() {
      if (!this.error) {
        let endpoint = `/api/device-template/`;
        apiService(endpoint)
          .then(data => {
            this.templates.push(...data.results);
          })
      }
    },
    getDateToday() {
      var today = new Date();
      this.date = today.getDate()+' / '+(today.getMonth()+1)+' / '+today.getFullYear();
    },
  },
  created() {
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
