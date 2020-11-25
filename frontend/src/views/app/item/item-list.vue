<template>
  <!-- ============ Body content start ============= -->
  <div class="main-content">
    <breadcumb :page="'List'" :folder="'Item'" />
    <!-- ICON BG -->
    <b-row>
      <b-col lg="6" md="6" sm="12">
        <b-card class="card-icon-bg card-icon-bg-primary o-hidden mb-30 text-center">
          <i class="i-Eci-Icon"></i>
          <div class="content">
            <p class="text-muted mt-2 mb-0">Items</p>
            <p class="inline text-primary text-24 line-height-1 mb-2">{{ this.items.length }}</p>
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

    <!-- ################################### -->
    <!-- ########### ITEM SECTION ########## -->
    <!-- ################################### -->
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-30" id="card-item">
          <div class="card-body p-0 mb-3">
            <b-row class="ml-3">
              <i class="nav-icon i-Add mt-3" style="font-size: 20px" id="new-item-section" @click="emptyInput('add')"></i>
              <h5 class="card-title border-bottom p-3 mb-2">New Item</h5>
            </b-row>
            <div class="mt-3" v-show="show">
              <b-form @submit.prevent="onSubmit">
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="4">
                    <b-form-input v-model="ArtNum" type="text" required placeholder="Article Number" ></b-form-input>
                  </b-col>
                  <b-col md="4">
                    <b-form-input v-model="Description" type="text" required placeholder="Description" ></b-form-input>
                  </b-col>
                  <b-col md="4">
                    <b-form-input v-model="Version" type="text" required placeholder="Version" ></b-form-input>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="3">
                    <b-form-input v-model="Cost" type="number" step="0.01" placeholder="Cost" ></b-form-input>
                  </b-col>
                  <b-col md="3">
                    <b-form-input v-model="GtinEan" type="text" placeholder="GTIN / EAN" ></b-form-input>
                  </b-col>
                  <b-col md="3">
                    <v-select v-model="ItemType" :options="itemTypes" @input="getStandardAttributes($event); getItemGroups($event);" 
                    placeholder="Choose Item Type" label="txtItemType"></v-select>
                  </b-col>
                  <b-col md="3">
                    <v-select v-model="ItemGroup" :options="itemGroups" required placeholder="Choose Item Group" label="txtItemGroup"
                    :disabled="itemGroups.length <= 0 && !updateStatus"></v-select>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="12">
                    <b-form-textarea id="area-1" v-model="Comment" placeholder="Enter memo ..." rows="3" max-rows="6"></b-form-textarea>
                  </b-col>
                </b-row>

                <!-- SELECT MODELS -->
                <b-row class="ml-3 mr-3 mt-4">
                  <b-col md="6">
                    <h6>Models</h6>
                    <multiselect
                        v-model="selectedModels" placeholder="Choose Models" label="txtModelName" 
                        track-by="id" :options="optionsModels" :multiple="true" :taggable="true" :close-on-select="false"
                        :searchable="true" open-direction="bottom">
                    </multiselect>
                  </b-col>
                    <b-col md="6">
                      <h6>Attributes</h6>
                      <multiselect
                        v-model="selectedAttributes" placeholder="Choose Attributes" label="txtNameAttribute" 
                        track-by="id" :options="optionAttributes" :multiple="true" :taggable="true" :close-on-select="false"
                        :searchable="true" open-direction="bottom">
                      </multiselect>
                    </b-col>
                </b-row>

                <!-- SELECT TEMPLATE ATTRIBUTES -->
                <div class="mt-3">
                  <b-row class="ml-3 mr-3 mb-3" v-for="att in selectedAttributes" :key="att.id">
                    <b-input-group v-if="att.txtValueType == 'Select'" class="ml-3 mr-3" :prepend="att.txtNameAttribute">
                      <b-form-select v-model="att.txtValueDefault" :options="getParameterTags(att.txtParameter)"></b-form-select>
                    </b-input-group>
                      <b-input-group v-else-if="att.txtValueType == 'Boolean'" class="ml-3 mr-3" :prepend="att.txtNameAttribute">
                        <b-form-select v-model="att.txtValueDefault" :options="optionBoolean"></b-form-select>
                      </b-input-group>
                    <b-input-group v-else class="ml-3 mr-3" :prepend="att.txtNameAttribute" :append="att.txtParameter">
                      <b-form-input v-model="att.txtValueDefault" type="text"></b-form-input>
                    </b-input-group>
                  </b-row>
                </div>

                <!-- UPDATE ATTRIBUTES -->
                <b-row class="mt-4 ml-3 mr-3" v-if="this.filteredAttributes.length != 0 && updateStatus">
                  <b-col md="12">
                    <h5 class="typo__label mb-3">Attributes of Item</h5>
                    <b-row class="mb-3" v-for="att in filteredAttributes" :key="att.id">
                      <b-input-group v-if="att.txtValueType == 'Select'" class="ml-3 mr-3" :prepend="att.txtNameAttribute">
                        <b-form-select v-model="att.txtValueAttribute" :options="getParameterTags(att.txtParameter)"></b-form-select>
                      </b-input-group>
                      <b-input-group v-else-if="att.txtValueType == 'Boolean'" class="ml-3 mr-3" :prepend="att.txtNameAttribute">
                        <b-form-select v-model="att.txtValueAttribute" :options="optionBoolean"></b-form-select>
                      </b-input-group>
                      <b-input-group v-else class="ml-3 mr-3" :prepend="att.txtNameAttribute" :append="att.txtParameter">
                        <b-form-input v-model="att.txtValueAttribute" type="text"></b-form-input>
                      </b-input-group>
                    </b-row>
                  </b-col>
                </b-row>
                
                <!-- NEW ITEM / UPDATE ITEM BUTTONS -->
                <b-row class="ml-3 mr-3 mt-5">
                  <b-col md="6" v-if="!updateStatus">
                    <b-button @click="emptyInput" block variant="outline-danger">Delete Input</b-button>
                  </b-col>
                  <b-col md="6" v-else-if="updateStatus">
                    <b-button @click="emptyInput" block variant="outline-info">Cancel</b-button>
                  </b-col>
                  <b-col md="6" v-if="!updateStatus">
                    <b-button type="submit" block variant="success" :disabled="disabled">Add Item</b-button>
                  </b-col>
                  <b-col md="6" v-else-if="updateStatus">
                    <b-button type="submit" block variant="warning" :disabled="disabled">Update Item</b-button>
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

    <!-- ######################################## -->
    <!-- ########### ATTRIBUTE SECTION ########## -->
    <!-- ######################################## -->
    <div class="row" v-if="updateAttributeStatus">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0 mb-3">
            <b-row class="ml-3">
              <i class="nav-icon i-Add mt-3" style="font-size: 20px" id="new-attribute-section" @click="emptyInput('add')"></i>
              <h5 class="card-title border-bottom p-3 mb-2">Update Attribute</h5>
            </b-row>
            <div class="mt-3">
              <b-form @submit.prevent="updateItemAttribute">
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
                    <b-form-input id="input-3" v-model="ValueAtt" type="text" required placeholder="Attribute Value" ></b-form-input>
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
                    <v-select  id="select-5" v-model="ValueAtt" :options="optionsBoolean" required placeholder="Choose Default Parameter" 
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
                    <v-select  id="select-6" v-model="ValueAtt" :options="ParameterTags" required placeholder="Choose Default Parameter" 
                    label="text" ></v-select>
                  </b-col>
                </b-row>

                <!-- NEW ATTRIBUTE / UPDATE ATTRIBUTE BUTTONS -->
                <b-row class="ml-3 mt-5 mr-3">
                  <b-col md="6">
                    <b-button @click="emptyAttributeInput" block variant="outline-info">Cancel</b-button>
                  </b-col>
                  <b-col md="6">
                    <b-button type="submit" block variant="warning" >Update Attribute</b-button>
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

    <!-- AG-GRID ITEMS -->
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0">
            <h5 class="card-title p-3 pb-0 mb-3">Items</h5>
            <AgGridVue class="ag-theme-alpine"
                id="gridItems"
                :defaultColDef="defaultColDef"
                :columnDefs="columnDefs"
                :rowSelection="rowSelection"
                :rowData="rowData"
                :gridOptions="gridOptions"
                :suppressRowClickSelection="true"
                @grid-ready="onGridReady"
                @cellValueChanged="updateItemGrid"
                @row-selected="onRowSelectedItem"
                :masterDetail="true"
                :detailCellRendererParams="detailCellRendererParams"
                :pagination="true"
                :paginationPageSize="paginationPageSize"
                :domLayout="domLayout"
                :getContextMenuItems="getContextMenu"
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

    <!-- AG-GRID ATTRIBUTES -->
    <div class="row" v-if="rowData1 != null">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0">
            <h5 class="card-title p-3 pb-0 mb-3">Attributes</h5>
            <AgGridVue class="ag-theme-alpine"
                id="gridAttributes"
                @cellValueChanged="updateAttributeGrid"
                @grid-ready="onGridReady1"
                :defaultColDef="defaultColDef1"
                :columnDefs="columnDefs1"
                :rowSelection="rowSelection"
                :rowData="rowData1"
                :gridOptions="gridOptions1"
                :suppressRowClickSelection="true"
                :pagination="false"
                :getContextMenuItems="getContextMenu1"
                :domLayout="domLayout"
                :modules="modules">
            </AgGridVue>
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
    title: "Item"
  },
  components: {
    AgGridVue, InputTag
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
      frameworkComponents: null,
      detailCellRendererParams: null,
      domLayout: null,
      modules: AllModules,

      // AG-GRID ATTRIBUTES VARIABLES
      gridOptions1: null,
      gridApi1: null,
      gridColumnApi1: null,
      defaultColDef1: null,
      columnDefs1: null,
      rowData1: null,
      defaultColDef1: null,
      paginationPageSize1: 0,

      // VUE ATTRIBUTE VARIABLES
      updateAttributeId: null,
      updateAttributeStatus: false,
      KeyAtt: null,
      NameAtt: null,
      ValueAtt: null,
      ValueType: null,
      Parameter: null,
      ParameterTags: [],
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
      
      // VUE VARIABLES
      items: [],
      attributes: [],
      tempAttributes: [],
      models: [],
      standardAttributes: [],
      filteredStandardAttributes: [],
      itemTypes: [],
      itemGroups: [],
      show: false,
      selectedModels: null,
      selectedAttributes: [],
      filteredAttributes: [],
      attValue: null,

      ArtNum: null,
      Description: null,
      ItemType: null,
      Version: null,
      Cost: null,
      GtinEan: null,
      ItemGroup:null,
      Link: null,
      Comment: null,
      date: null,
      error: false,
      updateStatus: false,
      updateId: null,
      selectedItem: false,
      optionsItemGroup: [
        { code: '2D', label: '2D' },
        { code: '3D', label: '3D' },
        { code: 'FC', label: 'Full Cover' },
      ],
      optionsModels: [],
      optionAttributes: [],
      optionBoolean: [
        { code: 'true', label: 'Yes' },
        { code: 'false', label: 'No' },
      ],
    };
  },
  beforeMount() {
    this.gridOptions = {};
    this.gridOptions1 = {};
    this.rowSelection = 'single';
    this.domLayout = 'autoHeight';
    this.paginationPageSize = 10;
    this.columnDefs = [
      {headerName: "Article Number", field: "txtArticleNumber", filter: 'agTextColumnFilter', cellRenderer: 'agGroupCellRenderer', checkboxSelection: true,},
      {headerName: "Item Description", field: "txtDescription", filter: 'agTextColumnFilter', width: 300,},
      {headerName: "Item Type", field: "idItemType.txtItemType", filter: 'agTextColumnFilter', editable: false, },
      {headerName: "Item Group", field: "idItemGroup.txtItemGroup", filter: 'agTextColumnFilter',},
      {headerName: "Version", field: "txtVersion", filter: 'agTextColumnFilter',},
      {headerName: "Cost", field: "curCost", filter: 'agTextColumnFilter', hide: true,},
      {headerName: "GTIN / EAN", field: "txtGtinEan", filter: 'agTextColumnFilter',},
      {headerName: "Link", field: "txtLink", filter: 'agTextColumnFilter', editable: false,},
      {headerName: "Memo", field: "txtComment", filter: 'agTextColumnFilter', },
    ],
    this.columnDefs1 = [
      {headerName: "Key Attribute", field: "txtKeyAttribute", filter: 'agTextColumnFilter', },
      {headerName: "Name Attribute", field: "txtNameAttribute", filter: 'agTextColumnFilter', },
      {headerName: "Value Attribute", field: "txtValueAttribute", filter: 'agTextColumnFilter', },
      {headerName: "Value Type", field: "txtValueType", filter: 'agTextColumnFilter', },
      {headerName: "Parameter", field: "txtParameter", filter: 'agTextColumnFilter', },
    ],
    this.defaultColDef = { flex: 1, editable: true, resizable: true, sortable: true, filter: true, floatingFilter: true, };
    this.defaultColDef1 = { flex: 1, editable: true, resizable: true, sortable: true, filter: true, floatingFilter: true, };
    this.detailCellRendererParams = {
      detailGridOptions: {
        rowSelection: 'single',
        suppressRowClickSelection: true,
        enableRangeSelection: true,
        pagination: true,
        paginationAutoPageSize: true,
        columnDefs: [
          { field: 'txtModelName', headerName: 'Model Name' },
          { field: 'txtModelStatus', headerName: 'Model Status' },
          { field: 'txtComment', headerName: 'Memo' },
          ],
        defaultColDef: { flex: 1, resizable: true, },
      },
      getDetailRowData: (params) => {
        params.successCallback(params.data.idModel);
      },
    }
    this.rowSelection = 'single';
    this.domLayout = 'autoHeight';
    this.paginationPageSize = 10;
    this.paginationPageSize1 = 10;
  },
  mounted() {
    if(localStorage.getItem('selModel')) {
      this.emptyInput('add');
      this.selectedModels = JSON.parse(localStorage.getItem('selModel'));
    }
    if (JSON.parse(localStorage.getItem('itemList_columnStats')) != null) {
       this.gridOptions.columnApi.setColumnState(JSON.parse(localStorage.getItem('itemList_columnStats')));
    } else {
      this.gridApi = this.gridOptions.api;
      this.gridColumnApi = this.gridOptions.columnApi;
    }
  },
  beforeRouteLeave (to, from, next) {
      localStorage.removeItem('selModel')
      next();
  },
  computed: {
    disabled: function () {
      return !this.ArtNum ? true : !this.Description ? true : !this.ItemType ? true : !this.Version ? true : !this.ItemGroup ? true : !this.selectedModels ? true : false; 
    },
  },
  methods: {
    saveState() {
      localStorage.setItem('itemList_columnStats', JSON.stringify(this.gridOptions.columnApi.getColumnState()));
    },
    restoreState() {
      localStorage.setItem('itemList_columnStats', null);
    },
    getModelIds() {
      let el = this.selectedModels.map(e => e.id);
    },
    onBtExport() {
      this.gridApi.exportDataAsExcel({});
    },
    onSubmit() {
      if(!this.updateStatus) { this.addItem();
      } else { this.updateItem(); }
    },
    onPageSizeChanged(newPageSize) {
      var value = document.getElementById('page-size').value;
      this.gridApi.paginationSetPageSize(Number(value));
    },
    onRowSelectedItem(event) {
      this.rowData1 = null;
      this.selectedItem = this.selectedItem ? false : true
      if(event.node.selected == true) {
        this.getAttributes(event.data.id);
        window.localStorage.setItem('selItem', event.node.data.id)
      } else {
        this.attributes = [];
      }
    },
    onGridReady(params) { 
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi
    },
    onGridReady1(params) {
      this.gridApi1 = params.api;
      this.gridColumnApi1 = params.columnApi
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
      } else if(this.ValueType == 'Boolean') {
        this.ValueAtt = 'false'
        return val = null;
      } else if(this.ValueType == 'String') {
        return val = null;
      } else {
        return val = this.Parameter.toString();
      }
    },
    addItem() {
      if (this.ArtNum) {
        let models = this.selectedModels.map(e => e.id)
        console.log(models)
        console.log(this.ItemType.id)
        console.log(this.ItemGroup.id)
        let endpoint = `/api/item/`;
        apiService(endpoint, "POST", {
          idItemType: this.ItemType.id,
          idItemGroup: this.ItemGroup.id,
          txtArticleNumber: this.ArtNum,
          txtDescription: this.Description,
          txtVersion: this.Version,
          curCost: this.Cost,
          txtGtinEan: this.GtinEan,
          txtLink: this.Link,
          txtComment: this.Comment,
          idModel: models,
          })
          .then(response => {
            if (response != 'ERROR'){
              for (let i = 0; i < this.selectedAttributes.length; i++) {
                const el = this.selectedAttributes[i];
                let endpointAttributes = `/api/item-attribute/`;
                apiService(endpointAttributes, "POST", { 
                  txtKeyAttribute: el.txtKeyAttribute, 
                  txtNameAttribute: el.txtNameAttribute, 
                  txtValueAttribute: el.txtValueDefault, 
                  txtValueType: el.txtValueType, 
                  txtParameter: el.txtParameter,
                  idItem: response.id,
                })
              };
              this.getItems();
              this.emptyInput()
            } else {
              this.error = true;
            }
          })
          .catch(err => console.log(err));
        if (this.error) {
          this.error = false;
        }
      }
    },
    editItemMenu(params) {
      this.emptyInput();
      let sel = params.node.data;
      let models = sel.idModel;
      this.selectedModels = models;
      this.ItemType = sel.idItemType;
      this.ItemGroup = sel.idItemGroup;
      this.ArtNum = sel.txtArticleNumber;
      this.Description = sel.txtDescription;
      this.Version = sel.txtVersion;
      this.Cost = sel.curCost;
      this.GtinEan = sel.txtGtinEan;
      this.Link = sel.Link;
      this.Comment = sel.Comment;
      this.updateStatus = true;
      this.updateId = sel.id;
      this.getAttributes()
      this.show = true;
      document.documentElement.scrollTop = 0;
    },
    editAttributeMenu(params) {
      this.emptyAttributeInput();
      let sel = params.node.data;
      this.getParameter(params);
      this.KeyAtt = sel.txtKeyAttribute;
      this.NameAtt = sel.txtNameAttribute;
      this.ValueAtt = sel.txtValueAttribute;
      this.ValueType = sel.txtValueType;
      this.updateAttributeStatus = true;
      this.updateAttributeId = sel.id;
      document.documentElement.scrollTop = 0;
    },
    async updateItemGrid(event) {     
      let endpoint = `/api/item/${event.node.data.id}/`;
      try {
        await apiService(endpoint, "PATCH", { 
          txtArticleNumber: event.node.data.txtArticleNumber,
          txtDescription: event.node.data.txtDescription,
          idItemType: event.node.data.idItemType,
          idItemGroup: event.node.data.idItemGroup,
          txtVersion: event.node.data.txtVersion,
          curCost: event.node.data.curCost,
          txtGtinEan: event.node.data.txtGtinEan,
          txtLink: event.node.data.txtLink,
          txtComment: event.node.data.txtComment,
        })
        .catch(err => console.log(err));
      }
      catch (err) {
        console.log(err)
      }
    },
    async updateAttributeGrid(event) {     
      let endpoint = `/api/item-attribute/${event.node.data.id}/`;
      try {
        await apiService(endpoint, "PATCH", { 
          txtKeyAttribute: event.node.data.txtKeyAttribute,
          txtNameAttribute: event.node.data.txtNameAttribute,
          txtValueAttribute: event.node.data.txtValueAttribute,
          txtValueType: event.node.data.txtValueType,
          txtParameter: event.node.data.txtParameter,
        })
        .catch(err => console.log(err));
      }
      catch (err) {
        console.log(err)
      }
    },
    async updateItem() {
      let models = this.selectedModels.map(e => e.id);
      let endpoint = `/api/item/${this.updateId}/`;
      await apiService(endpoint, "PUT", { 
        txtArticleNumber: this.ArtNum,
        txtDescription: this.Description,
        idItemType: this.ItemType.id,
        idItemGroup: this.ItemGroup.id,
        txtVersion: this.Version,
        curCost: this.Cost,
        txtGtinEan: this.GtinEan,
        txtLink: this.Link,
        txtComment: this.Comment,
        idModel: models,})
        .then(response => {
          if (response != 'ERROR'){
            // ADD ATTRIBUTE
            for (let i = 0; i < this.selectedAttributes.length; i++) {
              let el = this.selectedAttributes[i];
              let endpointAttributes = `/api/item-attribute/`;
              apiService(endpointAttributes, "POST", { 
                txtKeyAttribute: el.txtKeyAttribute, 
                txtNameAttribute: el.txtNameAttribute, 
                txtValueAttribute: el.txtValueDefault, 
                txtValueType: el.txtValueType, 
                txtParameter: el.txtParameter,
                idItem: response.id,
              })
            }
            // UPDATE ATTRIBUTE
            for (let i = 0; i < this.filteredAttributes.length; i++) {
              let el = this.filteredAttributes[i];
              let endpointAttributes = `/api/item-attribute/${el.id}/`;
              apiService(endpointAttributes, "PUT", { 
                txtKeyAttribute: el.txtKeyAttribute, 
                txtNameAttribute: el.txtNameAttribute, 
                txtValueAttribute: el.txtValueAttribute, 
                txtValueType: el.txtValueType, 
                txtParameter: el.txtParameter,
                idItem: response.id,
              })
            };
            this.selectedItem = false;
            this.attributes = [];
            this.emptyInput();
            this.getItems();
          }
        })
        .catch(err => console.log(err));
    },
    async updateItemAttribute() {
      let endpoint = `/api/item-attribute/${this.updateAttributeId}/`;
      await apiService(endpoint, "PATCH", { txtParameter: this.setParameter(), txtKeyAttribute: this.KeyAtt,
        txtNameAttribute: this.NameAtt, txtValueAttribute: this.ValueAtt, txtValueType: this.ValueType, })
        .then(response => {
          this.rowData = null;
          this.rowData1 = null;
          this.emptyAttributeInput();
          this.getItems();
        })
        .catch(err => console.log(err));
    },
    openModal(params) {
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to delete the selected Item? => " + params.node.data.txtArticleNumber, {
          title: "Please Confirm", size: "m", buttonSize: "sm", okVariant: "danger", okTitle: "YES",
          cancelTitle: "NO", footerClass: "p-2", hideHeaderClose: false, centered: true })
        .then(value => { if (value) { this.deleteItem(params); }})
        .catch(err => console.log(err));
    },
    openModal1(params) {
      this.$bvModal
        .msgBoxConfirm("Do you really want to delete the Attribute? => " + params.node.data.txtNameAttribute, {
          title: "Please Confirm", size: "m", buttonSize: "sm", okVariant: "danger", okTitle: "YES",
          cancelTitle: "NO", footerClass: "p-2", hideHeaderClose: false, centered: true })
        .then(value => { if (value) { this.deleteAttribute(params); }})
        .catch(err => console.log(err));
    },
    async deleteItem(params) {
      let endpoint = `/api/item/${params.node.data.id}/`;
      await apiService(endpoint, "DELETE")
        .then(response => {
          if (response != 'ERROR') {
            this.getItems();
          } else {
            this.$bvToast.toast(`Can't delete this entry. Please check if there are dependent entries. Please delete those first!`, {
              title: 'DELETE WARNING', variant: 'danger', autoHideDelay: 6000, appendToast: false
            })
          }
        })
    },
    async deleteAttribute(params) {
      let endpoint = `/api/item-attribute/${params.node.data.id}/`;
      await apiService(endpoint, "DELETE")
        .then(response => {
          if (response != 'ERROR') {
            let id = window.localStorage.getItem('selItem');
            this.getAttributes(id);
          } else {
            this.$bvToast.toast(`Can't delete this entry. Please check if there are dependent entries. Please delete those first!`, {
              title: 'DELETE WARNING', variant: 'danger', autoHideDelay: 6000, appendToast: false
            })
          }
        })
    },
    emptyInput(event) {
      this.ItemType = this.ItemGroup = this.selectedModels = this.selectedAttributes = [];
      this.ArtNum = this.Description = this.Version = this.Cost = this.GtinEan = this.Link = this.Comment = null;
      if(event != 'add') {
        this.show = false;
      } else {
        this.updateStatus = false;
        this.show = !this.show;
      }
    },  
    emptyAttributeInput(event) {
      this.KeyAtt = this.NameAtt = this.ValueAtt = this.ValueType = this.Parameter = null;
      this.ParameterTags = [];
      this.updateAttributeStatus = false;
    },
    emptyLastValueType(event) {
      this.ValueDef = this.Parameter = null;
      this.ParameterTags = [];
    },
    getParameterTags(params) {
      return params.split(',');
    },
    getStandardAttributes(type) {
      this.standardAttributes = []
      this.selectedAttributes = [];
      if(type != null && !this.updateStatus) {
        let endpoint = `/api/standard-attribute-list/`;
        apiService(endpoint)
          .then(data => {
            this.standardAttributes.push(...data.results);
            for (let i = 0; i < this.standardAttributes.length; i++) {
              let el = this.standardAttributes[i];
              if(el.idItemType.txtItemType == type.txtItemType) {
                this.selectedAttributes.push(el.idKeyAttribute)
              }
            }
          })
      }
    },
    getItems() {
      if (!this.error) {
        this.items = [];
        let endpoint = `/api/item-list/`;
        apiService(endpoint)
          .then(data => {
            this.items.push(...data.results);
            this.rowData = this.items
          })
          .catch(err => console.log(err));
      }
    },
    getItemTypes() {
      this.itemTypes = [];
      let endpoint = `/api/item-type/`;
      apiService(endpoint)
        .then(data => { this.itemTypes.push(...data.results); })
        .catch(err => console.log(err));
    },
    getItemGroups(type) {
      this.itemGroups = [];
      if(type != null && !this.updateStatus) {
        this.itemGroups = [];
        let endpoint = `/api/item-group/`;
        apiService(endpoint)
          .then(data => { 
            this.itemGroups.push(...data.results);
            this.itemGroups = this.itemGroups.filter(e => e.idItemType === type.id);
          })
          .catch(err => console.log(err));
      }
    },
    getAttributes(val) {
      if (!this.error) {
        this.attributes = [];
        let endpoint = `/api/item-attribute/`;
        apiService(endpoint)
          .then(data => {
            this.attributes.push(...data.results);
            if(this.updateId != null) {
              this.filteredAttributes = this.attributes.filter(e => e.idItem == this.updateId)
            }
            if(val != null) {
              this.rowData1 = this.attributes.filter(e => e.idItem == val)
            }
          })
          .catch(err => console.log(err));
      }
    },
    getTemplateAttributes() {
      if (!this.error) {
        this.tempAttributes = [];
        let endpoint = `/api/item-template-attribute/`;
        apiService(endpoint)
          .then(data => {
            this.tempAttributes.push(...data.results);
            this.optionAttributes = this.tempAttributes
          })
          .catch(err => console.log(err));
      }
    },
    getModels() {
      if (!this.error) {
        this.models = [];
        let endpoint = `/api/model/`;
        apiService(endpoint)
          .then(data => {
            this.models.push(...data.results);
            this.optionsModels = this.models
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
          name: 'Edit Item',
          action: () => this.editItemMenu(params)
        },
        'separator',
        {
          name: 'Delete Item',
          action: () =>  this.openModal(params)
        },
        'export'
      ];
      return result;
    },
    getContextMenu1(params) {
      var result = [
        {
          name: 'Edit Attribute',
          action: () => this.editAttributeMenu(params)
        },
        'separator',
        {
          name: 'Delete Attribute',
          action: () => this.openModal1(params)
        },
        'separator',
        'export'
      ];
      return result;
    },
  },
  created() {
    this.getItems();
    this.getModels();
    this.getDateToday();
    this.getTemplateAttributes();
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
  #new-item-section {
    cursor: pointer;
    outline: none;
  }
  .input-group-append, .input-group-prepend, .dropdown-toggle {
    width: auto!important;
  }
  .input-group-text {
    font-weight: 800!important;
  }
</style>
