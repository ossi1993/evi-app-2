<template>
  <!-- ============ Body content start ============= -->
  <div class="main-content">
    <breadcumb :page="'List'" :folder="'Inspection'" />
    <!-- ICON BG -->
    <b-row>
      <b-col lg="6" md="6" sm="12">
        <b-card class="card-icon-bg card-icon-bg-primary o-hidden mb-30 text-center">
          <i class="i-File-Clipboard-File--Text"></i>
          <div class="content">
            <p class="text-muted mt-2 mb-0">Inspections</p>
            <p class="inline text-primary text-24 line-height-1 mb-2">{{ this.inspections.length }}</p>
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

    <!-- #################################### -->
    <!-- ########### ORDER SECTION ########## -->
    <!-- #################################### -->
    <div class="row" v-if="updateSampleStatus">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0 mb-3">
            <b-row class="ml-3">
              <i class="nav-icon i-Add mt-3" style="font-size: 20px"></i>
              <h5 class="card-title border-bottom p-3 mb-2">Update Sample</h5>
            </b-row>
            <div class="mt-3">
              <b-form @submit.prevent="updateSample">
                <b-row class="mt-4 ml-3 mr-3">
                  <b-col md="4">
                    <b-form-select v-model="Inspection" :options="inspections" value-field="id" 
                    text-field="txtInspectionNumber" required disabled></b-form-select>
                  </b-col>
                  <b-col md="4">
                    <b-form-select v-model="OrderItem" :options="orderItems" value-field="id" 
                    text-field="idItem.txtDescription" required disabled></b-form-select>
                  </b-col>
                  <b-col md="4">
                    <b-form-select v-model="SampleStatus" :options="optionStatus" value-field="value" 
                    text-field="text" required></b-form-select>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="12">
                    <b-form-textarea v-model="Comment" placeholder="Enter memo ..." rows="3" max-rows="6"></b-form-textarea>
                  </b-col>
                </b-row>

                <!-- UPDATE SAMPLE BUTTONS -->
                <b-row class="ml-3 mr-3 mt-5">
                  <b-col md="6">
                    <b-button @click="emptySampleInput" block variant="outline-info">Cancel</b-button>
                  </b-col>
                  <b-col md="6">
                    <b-button block variant="warning" type="submit">Update Sample</b-button>
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
              </b-form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ######################################## -->
    <!-- ########### ATTRIBUTE SECTION ########## -->
    <!-- ######################################## -->
    <div class="row" v-if="this.updateAttributeStatus">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0 mb-3">
            <b-row class="ml-3">
              <i class="nav-icon i-Add mt-3" style="font-size: 20px"></i>
              <h5 class="card-title border-bottom p-3 mb-2">Update Sample Attribute</h5>
            </b-row>
            <div class="mt-3">
              <b-form @submit.prevent="updateAttribute">
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="6">
                    <b-form-input v-model="KeyAtt" type="text" required placeholder="Key Attribute" ></b-form-input>
                  </b-col>
                  <b-col md="6">
                    <b-form-input v-model="NameAtt" type="text" required placeholder="Name Attribute" ></b-form-input>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="12">
                    <v-select v-model="ValueType" :options="optionsTypes" required placeholder="Choose Value Type" 
                    label="text" :reduce="Value => Value.value" @input="emptyLastValueType($event)" ></v-select>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-3" v-if="this.ValueType == 'Integer' || this.ValueType == 'Float' || this.ValueType == 'String'">
                  <b-col md="12">
                    <b-form-input v-model="ValueAtt" type="text" required placeholder="Value Default" ></b-form-input>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-3" v-if="this.ValueType == 'Float'">
                  <b-col md="12">
                    <v-select v-model="Parameter" :options="optionsUnits" required placeholder="Choose Parameter Unit" 
                    label="text" :reduce="Unit => Unit.value"></v-select>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-3" v-if="this.ValueType == 'Boolean'">
                  <b-col md="12">
                    <v-select v-model="ValueAtt" :options="optionsBoolean" required placeholder="Choose Default Parameter" 
                    label="text" :reduce="Boolean => Boolean.value"></v-select>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-3" v-if="this.ValueType == 'Select'">
                  <b-col md="12">
                    <input-tag class="input-group-text" v-model="ParameterTags" placeholder="[+] Add Parameter" :add-tag-on-keys='[13, 188, 9]'></input-tag>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-3" v-if="this.ValueType == 'Select'">
                  <b-col md="12">
                    <v-select v-model="ValueAtt" :options="ParameterTags" required placeholder="Choose Default Parameter" 
                    label="text" ></v-select>
                  </b-col>
                </b-row>

                <!-- MIN / MAX / TOLERANCE -->
                <b-row class="ml-3 mr-3 mt-3" v-if="this.ValueType == 'Integer' || this.ValueType == 'Float'">
                  <b-col md="4">
                    <b-form-input v-model="ValueMin" type="number" required placeholder="Value MIN" ></b-form-input>
                  </b-col>
                  <b-col md="4">
                    <b-form-input v-model="ValueMax" type="number" required placeholder="Value MAX" ></b-form-input>
                  </b-col>
                  <b-col md="4">
                    <b-form-input v-model="ValueTol" type="number" required placeholder="Value Tolerance" ></b-form-input>
                  </b-col>
                </b-row>

                <!-- NEW ATTRIBUTE / UPDATE ATTRIBUTE BUTTONS -->
                <b-row class="ml-3 mt-5 mr-3">
                  <b-col md="6">
                    <b-button @click="emptyAttributeInput" block variant="outline-info">Cancel</b-button>
                  </b-col>
                  <b-col md="6">
                    <b-button type="submit" block variant="warning">Update Attribute</b-button>
                  </b-col>
                </b-row>

                <!-- ERROR MESSAGE -->
                <b-row class="ml-3 mr-3">
                  <b-col md="12" class="mt-3">
                    <b-alert v-if="error" show variant="alert alert-card alert-danger" dismissible>
                      <strong class="text-capitalize">Error!</strong> The Input is not valid! Please make sure that the key attribute is unique and no special symbols are used.
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
            <h5 class="card-title p-3 pb-0 mb-3">Inspections</h5>
            <AgGridVue class="ag-theme-alpine"
                id="gridInspection"
                :defaultColDef="defaultColDef"
                :columnDefs="columnDefs"
                :rowSelection="rowSelection"
                :rowData="rowData"
                :gridOptions="gridOptions"
                :suppressRowClickSelection="true"
                :excelStyles="excelStyles"
                @cellValueChanged="updateInspectionGrid"
                @row-selected="onRowSelected"
                @gridReady="onGridReady"
                :pagination="true"
                :paginationPageSize="paginationPageSize"
                :getContextMenuItems="getContextMenu"
                :domLayout="domLayout"
                :animateRows="true"
                :isExternalFilterPresent="isExternalFilterPresent"
                :doesExternalFilterPass="doesExternalFilterPass"
                :modules="modules">
            </AgGridVue>
            <b-row>
              <b-col md="6">
                <div class="ml-3 fmr-3 mt-2 mb-2 text-left">
                  <b-button @click="changeExternalFilter('all')" size="sm" variant="outline-info">Show All</b-button>
                  <b-button @click="changeExternalFilter('work in progress')" class="ml-3" size="sm" variant="outline-info">Show Work In Progress</b-button>
                  <b-button @click="changeExternalFilter('on hold')" class="ml-3" size="sm" variant="outline-info">Show On Hold</b-button>
                  <b-button @click="changeExternalFilter('complete')" class="ml-3" size="sm" variant="outline-info">Show Complete</b-button>
                  <b-button @click="changeExternalFilter('declined')" class="ml-3" size="sm" variant="outline-info">Show Declined</b-button>
                </div>
              </b-col>
              <b-col md="6">
                <div class="ml-3 mr-3 mt-2 mb-2 text-right">
                    Page Size:
                    <select @change="onPageSizeChanged" id="page-size">
                        <option value="10" selected="">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="200">200</option>
                    </select>
                    <b-button @click="excelExportInspection" class="ml-3" size="sm" variant="outline-success">Export Excel</b-button>
                </div>
              </b-col>
            </b-row>
          </div>
        </div>
      </div>
    </div>

    <!-- AG-GRID SAMPLE -->
    <div class="row" v-if="rowData1 != null">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0">
            <h5 class="card-title p-3 pb-0 mb-3">Samples</h5>
            <AgGridVue class="ag-theme-alpine"
                id="gridSample"
                :defaultColDef="defaultColDef1"
                :columnDefs="columnDefs1"
                :rowSelection="rowSelection"
                :rowData="rowData1"
                :gridOptions="gridOptions1"
                :suppressRowClickSelection="true"
                @row-selected="onRowSelected1"
                @gridReady="onGridReady1"
                :pagination="true"
                :paginationPageSize="paginationPageSize1"
                :getContextMenuItems="getContextMenu1"
                :domLayout="domLayout"
                :modules="modules">
            </AgGridVue>
            <div class="ml-3 mr-3 mt-2 mb-2 text-right">
                Page Size:
                <select @change="onPageSizeChanged1" id="page-size-1">
                    <option value="10" selected="">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AG-GRID ATTRIBUTES -->
    <div class="row" v-if="rowData2 != null">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0">
            <h5 class="card-title p-3 pb-0 mb-3">Attributes</h5>
            <AgGridVue class="ag-theme-alpine"
                id="gridAttributes"
                :defaultColDef="defaultColDef2"
                :columnDefs="columnDefs2"
                :rowSelection="rowSelection"
                :rowData="rowData2"
                :gridOptions="gridOptions2"
                :suppressRowClickSelection="true"
                @cellValueChanged="updateAttributesGrid"
                @gridReady="onGridReady2"
                :pagination="true"
                :paginationPageSize="paginationPageSize2"
                :getContextMenuItems="getContextMenu2"
                :domLayout="domLayout"
                :modules="modules">
            </AgGridVue>
            <div class="ml-3 mr-3 mt-2 mb-2 text-right">
                Page Size:
                <select @change="onPageSizeChanged2" id="page-size-2">
                    <option value="10" selected="">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SAVE GRID STATUS -->
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

      // AG-GRID SAMPLE VARIABLES
      gridOptions1: null,
      gridApi1: null,
      columnApi1: null,
      columnDefs1: null,
      rowData1: null,
      defaultColDef1: null,
      paginationPageSize1: 0,

      // AG-GRID ATTRIBUTES VARIABLES
      gridOptions2: null,
      gridApi2: null,
      columnApi2: null,
      columnDefs2: null,
      rowData2: null,
      defaultColDef2: null,
      paginationPageSize2: 0,

      // VUE SAMPLE VARIABLES
      Inspection: [],
      OrderItem: [],
      Comment: null,
      SampleStatus: null,
      updateSampleStatus: false,
      updateSampleId: null,
      optionStatus: [
        { value: null, text: 'Choose Sample Status' },
        { value: 'Approved', text: 'Approved' },
        { value: 'Not Approved', text: 'Not Approved' },
        { value: 'Conditionally', text: 'Conditionally' },
        { value: 'Canceled', text: 'Canceled' },
      ],

      // VUE ATTRIBUTE VARIABLES
      updateAttributeStatus: false,
      updateAttributeId: null,
      IType: null,
      KeyAtt: null,
      NameAtt: null,
      ValueAtt: null,
      ValueType: null,
      Parameter: null,
      ParameterTags: [],
      ValueMin: null,
      ValueMax: null,
      ValueTol: null,
      
      // VUE VARIABLES
      inspections: [],
      samples: [],
      attributes: [],
      date: null,
      error: false,
      Superuser: false,
      selectedSample: false,
      selectedInspection: false,
      optionsInspectionStatus: [
        { value: 'Work In Progress', text: 'Work In Progress' },
        { value: 'On Hold', text: 'On Hold' },
        { value: 'Complete', text: 'Complete' },
        { value: 'Declined', text: 'Declined' },
      ],
      optionsTypes: [
        { value: 'Integer', text: 'Counter' },
        { value: 'Float', text: 'Measure' },
        { value: 'String', text: 'Text' },
        { value: 'Boolean', text: 'True/False' },
        { value: 'Select', text: 'Select' },
      ],
      optionsUnits: [
        { value: 'µm', text: 'µm' },
        { value: 'mm', text: 'mm' },
        { value: 'cm', text: 'cm' },
        { value: 'mg', text: 'mg' },
        { value: 'g', text: 'g' },
        { value: 'ml', text: 'ml' },
        { value: 'inch', text: 'inch' },
        { value: 'oz', text: 'oz' },
      ],
      optionsBoolean: [
        { value: 'true', text: 'True' },
        { value: 'false', text: 'False' },
      ],
    };
  },
  beforeMount() {
    this.gridOptions = {};
    this.gridOptions1 = {};
    this.gridOptions2 = {};
    this.columnDefs = [
      {headerName: "Inspection Number", field: "txtInspectionNumber", filter: 'agTextColumnFilter', checkboxSelection: true, },
      {headerName: "Inspection Status", field: "txtInspectionStatus", filter: 'agTextColumnFilter', cellEditor: 'agRichSelectCellEditor', cellEditorParams: { cellHeight: 50, values: ['Work In Progress', 'On Hold', 'Complete', 'Declined']}},
      {headerName: "Inspection Type", field: "idInspectionType.txtInspectionInitial", filter: 'agTextColumnFilter', },
      {headerName: "Inspector", field: "txtInspector", filter: 'agTextColumnFilter', },
      {headerName: "Inspection Date", field: "datInspection", filter: 'agTextColumnFilter', },
      {headerName: "Delivered On", field: "datDeliveredOn", filter: 'agTextColumnFilter', },
      {headerName: "Requested On", field: "datRequestedOn", filter: 'agTextColumnFilter', },
      {headerName: "Link", field: "txtLink", filter: 'agTextColumnFilter', },
      {headerName: "Memo", field: "txtComment", filter: 'agTextColumnFilter', },
    ],
    this.columnDefs1 = [
      {headerName: "Sample ID", field: "id", filter: 'agTextColumnFilter', checkboxSelection: true,  },
      {headerName: "Inspection Number", field: "idInspection.txtInspectionNumber", filter: 'agTextColumnFilter', },
      {headerName: "Order Number", field: "idOrderItem.idOrder.txtOrderNumber", filter: 'agTextColumnFilter', },
      {headerName: "Item Description", field: "idOrderItem.idItem.txtDescription", filter: 'agTextColumnFilter', },
      {headerName: "Article Number", field: "idOrderItem.idItem.txtArticleNumber", filter: 'agTextColumnFilter', },
      {headerName: "Sample Status", field: "txtSampleStatus", filter: 'agTextColumnFilter', },
      {headerName: "Memo", field: "txtComment", filter: 'agTextColumnFilter', },
    ],
    this.columnDefs2 = [
      {headerName: "Key Attribute", field: "txtKeyAttribute", filter: 'agTextColumnFilter',  },
      {headerName: "Name Attribute", field: "txtNameAttribute", filter: 'agTextColumnFilter',  },
      {headerName: "Value Attribute", field: "txtValueAttribute", filter: 'agTextColumnFilter', },
      {headerName: "Value Type", field: "txtValueType", filter: 'agTextColumnFilter', editable: false,  valueGetter: ValueTypeGetter, },
      {headerName: "Parameter", field: "txtParameter", filter: 'agTextColumnFilter', },
      {headerName: "Value Min", field: "txtValueMin", filter: 'agTextColumnFilter',  },
      {headerName: "Value Max", field: "txtValueMax", filter: 'agTextColumnFilter', },
      {headerName: "Value Tolerance", field: "txtValueTolerance", filter: 'agTextColumnFilter', },
    ],
    this.defaultColDef = { editable: true, resizable: true, sortable: true, filter: true, floatingFilter: true, };
    this.defaultColDef1 = { flex: 1, editable: false, resizable: true, sortable: true, filter: true, floatingFilter: true, };
    this.defaultColDef2 = { editable: true, resizable: true, sortable: true, filter: true, floatingFilter: true, };
    this.rowSelection = 'single';
    this.domLayout = 'autoHeight';
    this.paginationPageSize = 10;
    this.paginationPageSize1 = 10;
    this.paginationPageSize2 = 10;  
  },
  mounted() {
    if (JSON.parse(localStorage.getItem('inspectionList_columnStats')) != null) {
       this.gridOptions.columnApi.setColumnState(JSON.parse(localStorage.getItem('inspectionList_columnStats')));
    } else {
      this.gridApi = this.gridOptions.api;
      this.gridColumnApi = this.gridOptions.columnApi;
    }
  },
  methods: {
    saveState() {
      localStorage.setItem('inspectionList_columnStats', JSON.stringify(this.gridOptions.columnApi.getColumnState()));
    },
    restoreState() {
      localStorage.setItem('inspectionList_columnStats', null);
    },
    excelExportInspection() {
      this.gridApi.exportDataAsExcel({});
    },
    changeExternalFilter(val) {
      this.extFilter = val;
      this.gridApi.onFilterChanged();
    },
    isExternalFilterPresent() {
      return this.extFilter !== null;
    },
    doesExternalFilterPass(node) {
      switch (this.extFilter) {
        case 'all':
          return true;
        case 'work in progress':
          return node.data.txtInspectionStatus === 'Work In Progress';
        case 'on hold':
          return node.data.txtInspectionStatus === 'On Hold';
        case 'complete':
          return node.data.txtInspectionStatus === 'Complete';
        case 'declined':
          return node.data.txtInspectionStatus === 'Declined';
        default:
          return true;
      }
    },
    onGridReady(params) { 
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi
      setTimeout(() => {
        this.getSelectedInspection(params)
      }, 500);
    },
    onGridReady1(params) {
      this.gridApi1 = params.api;
      this.gridColumnApi1 = params.columnApi
    },
    onGridReady2(params) {
      this.gridApi2 = params.api;
      this.gridColumnApi2 = params.columnApi
    },
    onPageSizeChanged(newPageSize) {
      var value = document.getElementById('page-size').value;
      this.gridOptions.paginationSetPageSize(Number(value));
    },
    onPageSizeChanged1(newPageSize) {
      var value = document.getElementById('page-size-1').value;
      this.gridOptions1.paginationSetPageSize(Number(value));
    },
    onPageSizeChanged2(newPageSize) {
      var value = document.getElementById('page-size-2').value;
      this.gridOptions2.paginationSetPageSize(Number(value));
    },
    onRowSelected(event) {
      this.rowData1 = null;
      this.rowData2 = null;
      this.selectedInspection = this.selectedInspection ? false : true;
      this.selectedSample = false;
      if(event.node.selected == true) {
        this.getSamples(event.data.id);
      } else {
        this.samples = [];
        this.attributes = [];
      }
    },
    onRowSelected1(event) {
      this.selectedSample = this.selectedSample ? false : true
      if(event.node.selected == true) {
        this.getAttributes(event.data.id);
      }
    },
    getParameter(params) {
      if(params.node.data.txtValueType == 'Select') {
        this.ParameterTags = params.node.data.txtParameter.split(',');
      } else {
        this.Parameter = params.node.data.txtParameter;
      }
    },
    setParameter() {
      let val;
      if(this.ValueType == 'Select') {
        return val = this.ParameterTags.toString();
      } else if(this.ValueType == 'Integer' || this.ValueType == 'String' || this.ValueType == 'Boolean') {
        return val = null;
      } else if(this.ValueType == 'Float' ) {
        return val = this.Parameter.toString();
      }
    },
    editInspection(params) {
      localStorage.setItem('InspectionID', params.node.data.id)
      this.$router.push('inspection/')
    },
    editSampleMenu(params) {
      this.emptySampleInput();
      let sel = params.node.data;
      this.Inspection = sel.idInspection.id;
      this.OrderItem = sel.idOrderItem.id;
      this.SampleStatus = sel.txtSampleStatus;
      this.Comment = sel.txtComment;
      this.updateSampleStatus = true;
      this.updateSampleId = sel.id;
      document.documentElement.scrollTop = 0;
    },
    editAttributeMenu(params) {
      this.emptyAttributeInput();
      let sel = params.node.data;
      this.getParameter(params);
      this.KeyAtt = sel.txtKeyAttribute;
      this.NameAtt = sel.txtNameAttribute;
      this.ValueType = sel.txtValueType;
      this.ValueAtt = sel.txtValueAttribute;
      this.ValueMin = sel.txtValueMin;
      this.ValueMax = sel.txtValueMax;
      this.ValueTol = sel.txtValueTolerance;
      this.updateAttributeId = sel.id;
      this.updateAttributeStatus = true;
      document.documentElement.scrollTop = 0;
    },
    async updateSample() {
      let endpoint = `/api/sample/${this.updateSampleId}/`;
      await apiService(endpoint, "PATCH", {
        idInspection: this.Inspection,
        idOrderItem: this.OrderItem,
        txtSampleStatus: this.SampleStatus,
        txtComment: this.Comment,  })
          .then(response => {
            this.rowData1 = null;
            this.rowData2 = null;
            this.getInspections();
            this.emptySampleInput();
          })
    },
    async updateAttribute() {
      let endpoint = `/api/sample-attribute/${this.updateAttributeId}/`;
      await apiService(endpoint, "PATCH", { 
        txtKeyAttribute: this.KeyAtt,
        txtNameAttribute: this.NameAtt,
        txtValueType: this.ValueType,
        txtParameter: this.setParameter(),
        txtValueAttribute: this.ValueAtt,
        txtValueMin: this.ValueMin,
        txtValueMax: this.ValueMax,
        txtValueTolerance: this.ValueTol,
        })
        .then(response => {
          if (response != 'ERROR'){
            this.rowData1 = null;
            this.rowData2 = null;
            this.getInspections();
            this.emptyAttributeInput();
          }
        })
        .catch(err => console.log(err));
    },
    async updateInspectionGrid(event) {     
      let endpoint = `/api/inspection/${event.node.data.id}/`;
      try {
        await apiService(endpoint, "PATCH", { 
          txtInspectionNumber: event.node.data.txtInspectionNumber,
          txtInspectionStatus: event.node.data.txtInspectionStatus,
          txtInspectionType: event.node.data.txtInspectionType,
          txtInspector: event.node.data.txtInspector,
          datInspection: event.node.data.datInspection,
          datDeliveredOn: event.node.data.datDeliveredOn,
          datRequestedOn: event.node.data.datRequestedOn,
          txtRequestedBy: event.node.data.txtRequestedBy,
          txtLink: event.node.data.txtLink,
          txtComment: event.node.data.txtComment,
        })
        .catch(err => console.log(err));
      }
      catch (err) {
        console.log(err)
      }
    },
    async updateAttributesGrid(event) {     
      let endpoint = `/api/sample-attribute/${event.node.data.id}/`;
      try {
        await apiService(endpoint, "PATCH", { 
          txtKeyAttribute: event.node.data.txtKeyAttribute,
          txtNameAttribute: event.node.data.txtNameAttribute,
          txtValueAttribute: event.node.data.txtValueAttribute,
          txtValueType: event.node.data.txtValueType,
          txtParameter: event.node.data.txtParameter,
          txtValueMin: event.node.data.txtValueMin,
          txtValueMax: event.node.data.txtValueMax,
          txtValueTolerance: event.node.data.txtValueTolerance,
        })
        .catch(err => console.log(err));
      }
      catch (err) {
        console.log(err)
      }
    },
    openModal(params) {
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to delete the selected Inspection? => " + params.node.data.txtInspectionNumber, {
          title: "Please Confirm", size: "m", buttonSize: "sm", okVariant: "danger", okTitle: "YES",
          cancelTitle: "NO", footerClass: "p-2", hideHeaderClose: false, centered: true })
        .then(value => { if (value) { this.deleteInspection(params); } })
        .catch(err => console.log(err));
    },
    openModal1(params) {
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to delete the selected Sample?", {
          title: "Please Confirm", size: "m", buttonSize: "sm", okVariant: "danger", okTitle: "YES",
          cancelTitle: "NO", footerClass: "p-2", hideHeaderClose: false, centered: true })
        .then(value => { if (value) { this.deleteSample(params); } })
        .catch(err => console.log(err));
    },
    openModal2(params) {
      this.$bvModal
        .msgBoxConfirm("Do you really want to delete the Attribute? => " + params.node.data.txtNameAttribute, {
          title: "Please Confirm", size: "m", buttonSize: "sm", okVariant: "danger", okTitle: "YES",
          cancelTitle: "NO", footerClass: "p-2", hideHeaderClose: false, centered: true })
        .then(value => { if (value) { this.deleteAttribute(params); } })
        .catch(err => console.log(err));
    },
    async deleteInspection(params) {
      let endpoint = `/api/inspection/${params.node.data.id}/`;
      await apiService(endpoint, "DELETE")
        .then(response => {
          if (response != 'ERROR') {
            this.getInspections();
            this.rowData1 = null;
          } else {
            this.$bvToast.toast(`Can't delete this entry. Please check if there are dependent entries. Please delete those first!`, {
              title: 'DELETE WARNING', variant: 'danger', autoHideDelay: 6000, appendToast: false
            })
          }
        })
    },
    async deleteSample(params) {
      let endpoint = `/api/sample/${params.node.data.id}/`;
      await apiService(endpoint, "DELETE")
        .then(response => {
          if (response != 'ERROR') {
            this.getSamples(params.node.data.idInspection.id);
            this.rowData2 = null;
          } else {
            this.$bvToast.toast(`Can't delete this entry. Please check if there are dependent entries. Please delete those first!`, {
              title: 'DELETE WARNING', variant: 'danger', autoHideDelay: 6000, appendToast: false
            })
          }
        })
    },
    async deleteAttribute(params) {
      let endpoint = `/api/sample-attribute/${params.node.data.id}/`;
      await apiService(endpoint, "DELETE")
        .then(response => {
          if (response != 'ERROR') {
            this.getAttributes(params.node.data.idSample);
          } else {
            this.$bvToast.toast(`Can't delete this entry. Please check if there are dependent entries. Please delete those first!`, {
              title: 'DELETE WARNING', variant: 'danger', autoHideDelay: 6000, appendToast: false
            })
          }
        })
    },
    emptySampleInput(event) {
      this.SampleStatus = this.Comment = null;
      this.Inspection = this.OrderItem = [];
      this.updateSampleStatus = false;
    },
    emptyAttributeInput(event) {
      this.IType = this.ParameterTags = [];
      this.KeyAtt = this.NameAtt = this.ValueType = this.ValueDef = this.Parameter = this.ValueMin = this.ValueMax = this.ValueTol = null;
      this.updateAttributeStatus = false;
    },
    emptyLastValueType(event) {
      this.ValueAtt = this.Parameter = this.ValueMin = this.ValueMax = this.ValueTol = null;
      this.ParameterTags = [];
    },
    getInspections() {
      this.inspections = [];
      let endpointInspection = `/api/inspection-list/`;
      apiService(endpointInspection)
        .then(data => {
          this.inspections.push(...data.results);
          this.rowData = this.inspections
        })
        .catch(err => console.log(err));
    },
    getSamples(id) {
      this.samples = [];
      let endpointSample = `/api/sample-list/`;
      apiService(endpointSample)
        .then(data => {
          this.samples.push(...data.results);
          let el = this.samples.filter(e => e.idInspection.id == id)
          this.rowData1 = el
        })
        .catch(err => console.log(err));
    },
    getOrderItems() {
      this.orderItems = [];
      let endpoint = `/api/order-item-list/`;
      apiService(endpoint)
        .then(data => { this.orderItems.push(...data.results); })
        .catch(err => console.log(err));
    },
    getAttributes(id) {
      this.attributes = [];
      let endpointAttributes = `/api/sample-attribute/`;
      apiService(endpointAttributes)
        .then(data => {
          this.attributes.push(...data.results);
          let el = this.attributes.filter(e => e.idSample === id)
          this.rowData2 = el
        })
        .catch(err => console.log(err));
    },
    getDateToday() {
      var today = new Date();
      this.date = today.getDate()+' / '+(today.getMonth()+1)+' / '+today.getFullYear();
    },
    getSelectedInspection(event) {
      if(window.localStorage.getItem('selInspect') != null) {
        let el = parseInt(localStorage.getItem('selInspect'));
        event.api.forEachNode(rowNode => { rowNode.setSelected(rowNode.data.id === el) });
      }
    },
    getContextMenu(params) {
      var result = [
        {
          name: 'Edit Inspection',
          action: () => this.editInspection(params)
        },
        'separator',
        {
          name: 'Delete Inspection',
          action: () => this.openModal(params)
        },
        'separator',
        'export'
      ];
      return result;
    },
    getContextMenu1(params) {
      var result = [
        {
          name: 'Edit Sample',
          action: () => this.editSampleMenu(params)
        },
        'separator',
        {
          name: 'Delete Sample',
          action: () => this.openModal1(params)
        },
        'separator',
        'export'
      ];
      return result;
    },
    getContextMenu2(params) {
      var result = [
        {
          name: 'Edit Attribute',
          action: () => this.editAttributeMenu(params)
        },
        'separator',
        {
          name: 'Delete Attribute',
          action: () => this.openModal2(params)
        },
        'separator',
        'export'
      ];
      return result;
    },
    getSuperuser() {
      let el = localStorage.getItem("superuser")
      if(el == 'true') {
        this.Superuser = true;
      } else {
        this.Superuser = false;
      }
    },
  },
  created() {
    this.getInspections();
    this.getDateToday();
    this.getSuperuser();
    this.getOrderItems();
  },
  beforeRouteLeave (to, from, next) {
    window.localStorage.removeItem('selInspect');
    next()
  }
};

window.ValueTypeGetter = function(params) {
  if(params.data.txtValueType == 'String') {
    return 'Text'
  } else if(params.data.txtValueType == 'Integer') {
    return 'Counter'
  } else if(params.data.txtValueType == 'Float') {
    return 'Measure'
  } else if(params.data.txtValueType == 'Boolean') {
    return 'True/False'
  } else if(params.data.txtValueType == 'Select') {
    return 'Select'
  }
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
</style>
