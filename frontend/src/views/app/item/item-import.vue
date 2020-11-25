<template>
  <!-- ============ Body content start ============= -->
  <div class="main-content">
    <breadcumb :page="'Import'" :folder="'Item'" />

    <div class="row mt-5">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0">
            <AgGridVue class="ag-theme-alpine"
                id="gridImport"
                :defaultColDef="defaultColDef"
                :columnDefs="columnDefs"
                :rowSelection="rowSelection"
                :rowData="rowData"
                :gridOptions="gridOptions"
                :suppressRowClickSelection="true"
                @grid-ready="onGridReady"
                @row-selected="onRowSelected"
                :masterDetail="true"
                :detailCellRendererParams="detailCellRendererParams"
                :pagination="true"
                :paginationPageSize="paginationPageSize"
                :domLayout="domLayout"
                :modules="modules">
            </AgGridVue>
            <div class="ml-3 mr-3 mt-2 mb-2 text-right">
                Page Size:
                <select v-on:change="onPageSizeChanged()" id="page-size">
                    <option value="10" selected="">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                </select>
                <b-button @click="createItems" class="ml-3" size="sm" variant="outline-info">Create Items</b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-row class="ml-1 mr-3 mb-3">
      <b-collapse v-model="show">
        <b-button class="mr-4" @click="deleteInspection" variant="outline-danger">Delete Item Selection</b-button>
      </b-collapse>
    </b-row>
    <b-row class="mt-3 ml-1 mr-3 mb-3">
      <b-col md="4">
        <vue-csv-import class="ml-1 mr-3 mt-5"
          v-model="rowData" 
          :autoMatchFields="true"
          :headers="true"
          :canIgnore="true"
          :map-fields="['MANUFACTURER', 'MODEL', 'SUPPLIER', 'ARTICLE_NUMBER', 'DESCRIPTION',  'TYPE',  'VERSION', 'GLUE_TYPE', 
          'PROTECTION_TYPE', 'OUTLINE', 'MEDIUM', 'WIDTH_IN_MM', 'LENGTH_IN_MM', 'THICKNESS_GLASS_IN_MYM', 'COST_IN_USD', 'GTIN_EAN' ]">
          <template slot="hasHeaders" slot-scope="{headers, toggle}">
            <label>
              <input type="checkbox" id="hasHeaders" :value="headers" @change="toggle">
              Headers?
            </label>
          </template>
          <template slot="next" slot-scope="{load}">
            <b-button block variant="primary" @click.prevent="load">Load CSV</b-button>
          </template>    
          <template slot="submit" slot-scope="{submit}">
            <b-button variant="primary" @click.prevent="submit">Submit</b-button>
          </template>    
        </vue-csv-import>
      </b-col>
    </b-row>
  </div>
  <!-- ============ Body content End ============= -->
</template>

<script>
import { apiService } from "@/common/api.service.js";
import { AgGridVue } from '@ag-grid-community/vue';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import XLSX from 'xlsx';

export default {
  metaInfo: {    
    title: "Import"
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
      rowDataImport: null,
      rowSelection: null,
      defaultColDef: null,
      frameworkComponents: null,
      detailCellRendererParams: null,
      domLayout: null,
      modules: AllModules,
      // VUE VARIABLES
      rowDataStructured: null,
      templates: [],
      show: false,
      visible: false,
      date: null,
      next: null,
      error: false,
      file: null,
      excelFile: null,
      dataImport: '',
      csv: null,
      checked: true,
    };
  },
  beforeMount() {
    this.rowData = [];
    this.gridOptions = {};
    this.columnDefs = [
      {headerName: "Manufacturer", field: "MANUFACTURER", filter: 'agTextColumnFilter', checkboxSelection: true, headerCheckboxSelection: true,},
      {headerName: "Model", field: "MODEL", filter: 'agTextColumnFilter', },
      {headerName: "Supplier", field: "SUPPLIER", filter: 'agTextColumnFilter', },
      {headerName: "Article Number", field: "ARTICLE_NUMBER", filter: 'agTextColumnFilter', },
      {headerName: "Description", field: "DESCRIPTION", filter: 'agTextColumnFilter', },
      {headerName: "Type", field: "TYPE", filter: 'agTextColumnFilter', },
      {headerName: "Version", field: "VERSION", filter: 'agTextColumnFilter', },
      {headerName: "Glue Type", field: "GLUE_TYPE", filter: 'agTextColumnFilter', },
      {headerName: "Protection Type", field: "PROTECTION_TYPE", filter: 'agTextColumnFilter', },
      {headerName: "Outline", field: "OUTLINE", filter: 'agTextColumnFilter', },
      {headerName: "Medium", field: "MEDIUM", filter: 'agTextColumnFilter', },
      {headerName: "Width in mm", field: "WIDTH_IN_MM", filter: 'agTextColumnFilter', },
      {headerName: "Length in mm", field: "LENGTH_IN_MM", filter: 'agTextColumnFilter', },
      {headerName: "Thickness Glass in µm", field: "THICKNESS_GLASS_IN_MYM", filter: 'agTextColumnFilter', },
      {headerName: "Cost in USD", field: "COST_IN_USD", filter: 'agTextColumnFilter', },
      {headerName: "GTIN/EAN", field: "GTIN_EAN", filter: 'agTextColumnFilter', },
    ],
    this.defaultColDef = {
      editable: true,
      resizable: true,
      sortable: true,
      filter: true,
      floatingFilter: true,
    };
    this.rowSelection = 'single';
    this.domLayout = 'autoHeight';
    this.paginationPageSize = 10;
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    this.show = false;
  },
  methods: {
    onPageSizeChanged(newPageSize) {
      var value = document.getElementById('page-size').value;
      this.gridApi.paginationSetPageSize(Number(value));
    },
    onRowSelected(event) {
      this.show = this.show ? false : true
    },
    deleteInspection() {
      var index = this.gridApi.getSelectedNodes()[0].childIndex;
      this.$delete(this.rowData, index)
      this.show = this.show ? false : true
    },
    onGridReady(params) { 
    },
    onChangeInput(e) {
      this.importExcel(e);
    },
    structureGridItems() {
      let element = this.rowData
      let obj = [];
      let arr = {};
      for (let i = 0; i < element.length; i++) {
        let el = element[i]
        arr = {
          txtArticlenumber: el.ARTICLE_NUMBER,
          txtDescription: el.DESCRIPTION,
          txtType: el.TYPE,
          txtVersion: el.VERSION,
          curCost: el.COST_IN_USD,
          txtGtinEan: el.GTIN_EAN,
          txtOutline: el.OUTLINE,
          attributes: [], }
        let attGL = {
              txtKeyAttribute: 'IT_GL_TY',
              txtNameAttribute: 'Glue Type',
              txtValueAttribute: el.GLUE_TYPE,
              txtValueType: 'STRING',
              txtMeasureUnit: '', }
        let attPT = {
              txtKeyAttribute: 'IT_PT_TY',
              txtNameAttribute: 'Protection Type',
              txtValueAttribute: el.PROTECTION_TYPE,
              txtValueType: 'STRING',
              txtMeasureUnit: '', }
        let attMD = {
              txtKeyAttribute: 'IT_MD',
              txtNameAttribute: 'Medium',
              txtValueAttribute: el.MEDIUM,
              txtValueType: 'STRING',
              txtMeasureUnit: '', }
        let attWD = {
              txtKeyAttribute: 'IT_WD',
              txtNameAttribute: 'Width',
              txtValueAttribute: el.WIDTH_IN_MM,
              txtValueType: 'FLOAT',
              txtMeasureUnit: 'mm', }
        let attLE = {
              txtKeyAttribute: 'IT_LE',
              txtNameAttribute: 'Length',
              txtValueAttribute: el.LENGTH_IN_MM,
              txtValueType: 'FLOAT',
              txtMeasureUnit: 'mm', }
        let attTH = {
              txtKeyAttribute: 'IT_TH',
              txtNameAttribute: 'Thickness',
              txtValueAttribute: el.THICKNESS_GLASS_IN_MYM,
              txtValueType: 'FLOAT',
              txtMeasureUnit: 'µm', }

        if(el.GLUE_TYPE != '')
          arr.attributes.push(attGL)
        if(el.PROTECTION_TYPE != '')
          arr.attributes.push(attPT)
        if(el.MEDIUM != '')
          arr.attributes.push(attMD)
        if(el.WIDTH_IN_MM != '')
          arr.attributes.push(attWD)
        if(el.LENGTH_IN_MM != '')
          arr.attributes.push(attLE)
        if(el.THICKNESS_GLASS_IN_MYM != '')
          arr.attributes.push(attTH)

        obj.push(arr);
      }
      this.rowDataStructured = obj;
    },
    async createItems() {
      await this.structureGridItems();
      let element = this.rowDataStructured
      console.log(this.rowDataStructured)
      console.log(element)

      for (let i = 0; i < element.length; i++) {
        const el = element[i];
        console.log(el.txtArticlenumber)
        let endpoint = `/api/item/`;
        apiService(endpoint, "POST", {
          txtArticlenumber: el.txtArticlenumber,
          txtDescription: el.txtDescription,
          txtType: el.txtType,
          txtVersion: el.txtVersion,
          curCost: el.curCost,
          txtGtinEan: el.txtGtinEan,
          txtOutline: el.txtOutline,
          txtLink: null,
          deviceModels: [], })
          .then(response => {
            if(response != 'ERROR')
              for (let g = 0; g < el.attributes.length; g++) {
                let att = el.attributes[g];
                let endpointAttribute = `/api/item-attribute/`;
                apiService(endpointAttribute, "POST", {
                  txtKeyAttribute: att.txtKeyAttribute,
                  txtNameAttribute: att.txtNameAttribute,
                  txtValueAttribute: att.txtValueAttribute,
                  txtValueType: att.txtValueType,
                  txtMeasureUnit: att.txtMeasureUnit,
                  idItem: response.id, })
              }
          })
      }
      this.$router.push('item-list');
    },
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
