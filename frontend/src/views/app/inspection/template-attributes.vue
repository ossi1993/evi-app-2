<template>
  <!-- ============ Body content start ============= -->
  <div class="main-content">
    <breadcumb :page="'Inspection Template Attributes'" :folder="'Inspection'" />
    <b-row>
      <!-- ICON BG -->
      <b-col lg="6" md="6" sm="12">
        <b-card class="card-icon-bg card-icon-bg-primary o-hidden mb-30 text-center">
          <i class="i-Atom"></i>
          <div class="content">
            <p class="text-muted mt-2 mb-0">Attributes</p>
            <p class="inline text-primary text-24 line-height-1 mb-2">{{ this.attributes.length }}</p>
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

    <!-- ######################################## -->
    <!-- ########### ATTRIBUTE SECTION ########## -->
    <!-- ######################################## -->
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0 mb-3">
            <b-row class="ml-3">
              <i class="nav-icon i-Add mt-3" style="font-size: 20px" id="new-attribute-section" @click="emptyInput('add')"></i>
              <h5 class="card-title border-bottom p-3 mb-2">New Inspection Attribute</h5>
            </b-row>
            <div class="mt-3" v-show="show">
              <b-form @submit.prevent="onSubmit">
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="12">
                    <v-select v-model="IType" :options="itemTypes" required placeholder="Choose Item Type" label="txtItemType"></v-select>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="6">
                    <b-form-input id="input-1" v-model="KeyAtt" type="text" required placeholder="Key Attribute" ></b-form-input>
                  </b-col>
                  <b-col md="6">
                    <b-form-input id="input-2" v-model="NameAtt" type="text" required placeholder="Name Attribute" ></b-form-input>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="12">
                    <v-select  id="select-2" v-model="ValueType" :options="optionsTypes" required placeholder="Choose Value Type" 
                    label="text" :reduce="Value => Value.value" @input="emptyLastValueType($event)" ></v-select>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-3" v-if="this.ValueType == 'Integer' || this.ValueType == 'Float' || this.ValueType == 'String'">
                  <b-col md="12">
                    <b-form-input id="input-3" v-model="ValueDef" type="text" required placeholder="Value Default" ></b-form-input>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-3" v-if="this.ValueType == 'Float'">
                  <b-col md="12">
                    <v-select  id="select-4" v-model="Parameter" :options="optionsUnits" required placeholder="Choose Parameter Unit" 
                    label="text" :reduce="Unit => Unit.value"></v-select>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-3" v-if="this.ValueType == 'Boolean'">
                  <b-col md="12">
                    <v-select  id="select-5" v-model="ValueDef" :options="optionsBoolean" required placeholder="Choose Default Parameter" 
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
                    <v-select  id="select-6" v-model="ValueDef" :options="ParameterTags" required placeholder="Choose Default Parameter" 
                    label="text" ></v-select>
                  </b-col>
                </b-row>

                <!-- MIN / MAX / TOLERANCE -->
                <b-row class="ml-3 mr-3 mt-3" v-if="this.ValueType == 'Integer' || this.ValueType == 'Float'">
                  <b-col md="4">
                    <b-form-input id="input-4" v-model="ValueMin" type="number" required placeholder="Value MIN" ></b-form-input>
                  </b-col>
                  <b-col md="4">
                    <b-form-input id="input-5" v-model="ValueMax" type="number" required placeholder="Value MAX" ></b-form-input>
                  </b-col>
                  <b-col md="4">
                    <b-form-input id="input-6" v-model="ValueTol" type="number" required placeholder="Value Tolerance" ></b-form-input>
                  </b-col>
                </b-row>

                <!-- NEW ATTRIBUTE / UPDATE ATTRIBUTE BUTTONS -->
                <b-row class="ml-3 mt-5 mr-3">
                  <b-col md="6" v-if="!updateStatus">
                    <b-button @click="emptyInput" block variant="outline-danger">Delete Input</b-button>
                  </b-col>
                  <b-col md="6" v-else-if="updateStatus">
                    <b-button @click="emptyInput" block variant="outline-info">Cancel</b-button>
                  </b-col>
                  <b-col md="6" v-if="!updateStatus">
                    <b-button type="submit" block variant="success" :disabled="disabled">Add Attribute</b-button>
                  </b-col>
                  <b-col md="6" v-else-if="updateStatus">
                    <b-button type="submit" block variant="warning" :disabled="disabled">Update Attribute</b-button>
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

    <!-- AG-GRID ATTRIBUTES -->
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0">
            <AgGridVue class="ag-theme-alpine"
                id="gridAttributes"
                :defaultColDef="defaultColDef"
                :columnDefs="columnDefs"
                :rowSelection="rowSelection"
                :rowData="rowData"
                :gridOptions="gridOptions"
                :suppressRowClickSelection="true"
                @cellValueChanged="updateAttributeGrid"
                @row-selected="onRowSelected"
                :getContextMenuItems="getContextMenu"
                :pagination="true"
                :paginationPageSize="10"
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
import InputTag from 'vue-input-tag'

export default {
  metaInfo: {    
    title: "Inspection Attributes"
  },
  components: {
    AgGridVue, InputTag
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
      attributes: [],
      show: false,
      IType: null,
      KeyAtt: null,
      NameAtt: null,
      ValueDef: null,
      ValueType: null,
      Parameter: null,
      ParameterTags: [],
      ValueMin: null,
      ValueMax: null,
      ValueTol: null,
      date: null,
      error: false,
      updateStatus: false,
      updateId: null,
      itemTypes: [],
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
    this.defaultColDef = { editable: true, resizable: true, sortable: true, filter: true, floatingFilter: true, };
    this.rowSelection = 'single';
    this.domLayout = 'autoHeight';
    this.paginationPageSize = 10;
    this.columnDefs = [
      {headerName: "Item Type", field: "idItemType.txtItemType", filter: 'agTextColumnFilter', editable: false, },
      {headerName: "Key Attribute", field: "txtKeyAttribute", filter: 'agTextColumnFilter',},
      {headerName: "Name Attribute", field: "txtNameAttribute", filter: 'agTextColumnFilter', },
      {headerName: "Value Default", field: "txtValueDefault", filter: 'agTextColumnFilter', editable: false, },
      {headerName: "Value Type", field: "txtValueType", filter: 'agTextColumnFilter', editable: false, valueGetter: ValueTypeGetter, },
      {headerName: "Parameter", field: "txtParameter", filter: 'agTextColumnFilter', editable: false, },
      {headerName: "Value Min", field: "txtValueMin", filter: 'agTextColumnFilter', },
      {headerName: "Value Max", field: "txtValueMax", filter: 'agTextColumnFilter', },
      {headerName: "Value Tolerance", field: "txtValueTolerance", filter: 'agTextColumnFilter', },
    ]
  },
  mounted() {
    if (JSON.parse(localStorage.getItem('inspectionAttributeTemp_columnStats')) != null) {
       this.gridOptions.columnApi.setColumnState(JSON.parse(localStorage.getItem('inspectionAttributeTemp_columnStats')));
    } else {
      this.gridApi = this.gridOptions.api;
      this.gridColumnApi = this.gridOptions.columnApi;
    }
  },
  computed: {
    disabled: function () {
      if(this.ValueType == 'Boolean') {
        return !this.IType ? true : !this.KeyAtt ? true : !this.NameAtt ? true : !this.ValueType ? true : !this.ValueDef ? true : false; 
      } else if(this.ValueType == 'Integer') {
        return !this.IType ? true : !this.KeyAtt ? true : !this.NameAtt ? true : !this.ValueType ? true : !this.ValueDef ? true : false ; 
      } else if(this.ValueType == 'Float') {
        return !this.IType ? true : !this.KeyAtt ? true : !this.NameAtt ? true : !this.ValueType ? true : !this.ValueDef ? true : false; 
      } else if(this.ValueType == 'String') {
        return !this.IType ? true : !this.KeyAtt ? true : !this.NameAtt ? true : !this.ValueType ? true : !this.ValueDef ? true : false; 
      } else if(this.ValueType == 'Select') {
        return !this.IType ? true : !this.KeyAtt ? true : !this.NameAtt ? true : !this.ValueType ? true : !this.ValueDef ? true : false; 
      } else {
        return !this.IType ? true : !this.KeyAtt ? true : !this.NameAtt ? true : !this.ValueType ? true : false; 
      }
    },
  },
  methods: {
    saveState() {
      localStorage.setItem('inspectionAttributeTemp_columnStats', JSON.stringify(this.gridOptions.columnApi.getColumnState()));
    },
    restoreState() {
      localStorage.setItem('inspectionAttributeTemp_columnStats', null);
    },
    onPageSizeChanged(newPageSize) {
      var value = document.getElementById('page-size').value;
      this.gridApi.paginationSetPageSize(Number(value));
    },
    onRowSelected(event) {
      this.show = this.show ? false : true
    },
    onSubmit() {
      if(!this.updateStatus) { this.addAtt();
      } else { this.updateAttribute(); }
    },
    autoSizeAll(skipHeader) {
      var allColumnIds = [];
      this.gridColumnApi.getAllColumns().forEach(function(column) {
        allColumnIds.push(column.colId);
      });
      this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
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
    addAtt() {
      let endpoint = `/api/inspection-template-attribute/`;
      apiService(endpoint, "POST", { 
        txtParameter: this.setParameter(),
        idItemType: this.IType.id,
        txtKeyAttribute: this.KeyAtt,
        txtNameAttribute: this.NameAtt,
        txtValueType: this.ValueType,
        txtValueMin: this.ValueMin,
        txtValueMax: this.ValueMax,
        txtValueTolerance: this.ValueTol,
        txtValueDefault: this.ValueDef,
        })
        .then(response => {
          if (response != 'ERROR'){
            this.getAtt();
            this.emptyInput();
            this.error = false;
          } else {
            this.error = true;
          }
        })
        .catch(err => console.log(err));
   },
    editAttributeMenu(params) {
      this.emptyInput();
      let sel = params.node.data;
      this.getParameter(params);
      this.IType = sel.idItemType;
      this.KeyAtt = sel.txtKeyAttribute;
      this.NameAtt = sel.txtNameAttribute;
      this.ValueType = sel.txtValueType;
      this.ValueDef = sel.txtValueDefault;
      this.ValueMin = sel.txtValueMin;
      this.ValueMax = sel.txtValueMax;
      this.ValueTol = sel.txtValueTolerance;
      this.updateStatus = true;
      this.updateId = sel.id;
      this.show = true;
      document.documentElement.scrollTop = 0;
    },
    async updateAttribute() {
      let endpoint = `/api/inspection-template-attribute/${this.updateId}/`;
      await apiService(endpoint, "PUT", { 
        idItemType: this.IType.id,
        txtKeyAttribute: this.KeyAtt,
        txtNameAttribute: this.NameAtt,
        txtValueType: this.ValueType,
        txtParameter: this.setParameter(),
        txtValueDefault: this.ValueDef,
        txtValueMin: this.ValueMin,
        txtValueMax: this.ValueMax,
        txtValueTolerance: this.ValueTol,
        })
        .then(response => {
          if (response != 'ERROR'){
            this.emptyInput();
            this.getAtt();
          }
        })
        .catch(err => console.log(err));
    },
    async updateAttributeGrid(event) {     
      let endpoint = `/api/inspection-template-attribute/${event.node.data.id}/`;
      try {
        await apiService(endpoint, "PATCH", { 
          idItemType: event.node.data.idItemType,
          txtKeyAttribute: event.node.data.txtKeyAttribute,
          txtNameAttribute: event.node.data.txtNameAttribute,
          txtValueDefault: event.node.data.txtValueDefault,
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
        .msgBoxConfirm("Are you sure you want to delete the selected Attribute? => " + params.node.data.txtNameAttribute, {
          title: "Please Confirm", size: "m", buttonSize: "sm", okVariant: "danger", okTitle: "YES",
          cancelTitle: "NO", footerClass: "p-2", hideHeaderClose: false, centered: true
        })
        .then(value => { if (value) { this.deleteAttribute(params); } })
        .catch(err => console.log(err));
    },
    async deleteAttribute(params) {
      let endpoint = `/api/inspection-template-attribute/${params.node.data.id}/`;
      await apiService(endpoint, "DELETE")
        .then(response => {
          if (response != 'ERROR') {
            this.getAtt();
          } else {
            this.$bvToast.toast(`Can't delete this entry. Please check if there are dependent entries. Please delete those first!`, {
              title: 'DELETE WARNING', variant: 'danger', autoHideDelay: 6000, appendToast: false
            })
          }
        })
    },
    emptyInput(event) {
      this.IType = this.ParameterTags = [];
      this.KeyAtt = this.NameAtt = this.ValueType = this.ValueDef = this.Parameter = this.ValueMin = this.ValueMax = this.ValueTol = null;
      if(event != 'add') {
        this.show = false;
      } else {
        this.show = !this.show;
      }
    },
    emptyLastValueType(event) {
      this.ValueDef = this.Parameter = this.ValueMin = this.ValueMax = this.ValueTol = null;
      this.ParameterTags = [];
    },
    getAtt() {
      if (!this.error) {
        this.attributes = [];
        let endpoint = `/api/inspection-template-attribute-list/`;
        apiService(endpoint)
          .then(data => {
            this.attributes.push(...data.results);
            this.rowData = this.attributes
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
          name: 'Edit Attribute',
          action: () => this.editAttributeMenu(params)
        },
        'separator',
        {
          name: 'Delete Attribute',
          action: () =>  this.openModal(params)
        },
        'export'
      ];
      return result;
    },
  },
  created() {
    this.getAtt();
    this.getDateToday();
    this.getItemTypes();
  },
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
  #new-attribute-section {
    cursor: pointer;
    outline: none;
  }
  .input-tag {
    background-color:#003473!important;
    color: #fff!important;
    border: 1px solid #003473!important;
  }
  .vue-input-tag-wrapper {
    vertical-align: baseline!important;
    height: calc(1.9695rem + 8px);
    background: #f8f9fa;
    border: 1px solid #ced4da;
  }
  .remove:empty:before {
    color: #fff
  }
</style>
