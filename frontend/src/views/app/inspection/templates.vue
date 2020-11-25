<template>
  <!-- ============ Body content start ============= -->
  <div class="main-content">
    <breadcumb :page="'Templates'" :folder="'Inspection'" />
    <!-- ICON BG -->
    <b-row>
      <b-col lg="6" md="6" sm="12">
        <b-card class="card-icon-bg card-icon-bg-primary o-hidden mb-30 text-center">
          <i class="i-File"></i>
          <div class="content">
            <p class="text-muted mt-2 mb-0">Templates</p>
            <p class="inline text-primary text-24 line-height-1 mb-2">{{ this.templates.length }}</p>
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
    <!-- ########### TEMPLATES SECTION ########## -->
    <!-- ######################################## -->
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0 mb-3">
            <b-row class="ml-3">
              <i class="nav-icon i-Add mt-3" style="font-size: 20px" id="new-template-section" @click="emptyInput('add')"></i>
              <h5 class="card-title border-bottom p-3 mb-2">New Template</h5>
            </b-row>
            <div class="ml-3 mr-3" v-show="show">
              <b-form>
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="12">
                    <b-form-input id="input-1" v-model="TempName" type="text" required placeholder="Template Name" ></b-form-input>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="12" v-if="updateStatus">
                    <multiselect
                        v-model="selectedInspectionType" tag-placeholder="Choose Inspection Type" placeholder="Search inspection type" label="txtInspectionType" 
                        track-by="id" :options="optionInspectionTypes" :multiple="false" :taggable="false" :close-on-select="true"
                        :searchable="true" open-direction="bottom">
                    </multiselect>
                  </b-col>
                  <b-col md="6" v-if="!updateStatus">
                    <multiselect
                        v-model="selectedInspectionType" tag-placeholder="Choose Inspection Type" placeholder="Search inspection type" label="txtInspectionType" 
                        track-by="id" :options="optionInspectionTypes" :multiple="false" :taggable="false" :close-on-select="true"
                        :searchable="true" open-direction="bottom">
                    </multiselect>
                  </b-col>
                  <b-col md="6" v-if="!updateStatus">
                    <multiselect
                        v-model="selectedItemTypes" tag-placeholder="Choose Item Type" placeholder="Search item type" label="txtItemType" 
                        track-by="id" :options="optionItemTypes" :multiple="true" :taggable="false" :close-on-select="false"
                        :searchable="true" open-direction="bottom" @input="onChange($event)" @remove="onChange($event)">
                    </multiselect>
                  </b-col>
                </b-row>

                <!-- ATTRIBUTES -->
                <div v-if="selectedItemTypes != ''">
                  <b-row md="12" class="ml-5 mr-5 mt-3 mb-3" v-for="element in filteredAttributes" :key="element.id">
                    <h5 class="mb-1">{{ element.type }}</h5>
                    <b-col md="12" v-for="atts in element.attributes" :key="atts.id">
                      <b-form-checkbox-group v-model="selectedAttributes" :options="atts" multiple
                        value-field="id" text-field="txtNameAttribute"></b-form-checkbox-group>
                    </b-col>
                  </b-row>
                </div>

              <!-- NEW TEMPLATE / UPDATE TEMPLATE BUTTONS -->
              <b-row class="ml-3 mt-5 mr-3">
                <b-col md="6" v-if="!updateStatus">
                  <b-button @click="emptyInput" block variant="outline-danger">Delete Input</b-button>
                </b-col>
                <b-col md="6" v-else-if="updateStatus">
                  <b-button @click="emptyInput" block variant="outline-info">Cancel</b-button>
                </b-col>
                <b-col md="6" v-if="!updateStatus">
                  <b-button @click="addTemplate" block variant="success" :disabled="disabled">Add Template</b-button>
                </b-col>
                <b-col md="6" v-else-if="updateStatus">
                  <b-button @click="updateTemplate" block variant="warning" :disabled="disabled">Update Template</b-button>
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

    <!-- ################################################ -->
    <!-- ########### CREATE INSPECTION SECTION ########## -->
    <!-- ################################################ -->
    <div class="row" v-if="show1">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0 mb-3">
            <b-row class="ml-3">
              <i class="nav-icon i-Add mt-3" style="font-size: 20px"></i>
              <h5 class="card-title border-bottom p-3 mb-2">Create Inspection</h5>
            </b-row>
            <div class="ml-3 mr-3">
              <b-form @submit.prevent="$bvModal.show('modal-inspection')">
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="4">
                    <b-form-group label="Name:" label-size="sm">
                      <b-form-input v-model="selInspectionName" type="text" required :disabled="true"></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col md="4">
                    <b-form-group label="Type:" label-size="sm">
                      <b-form-input v-model="selInspectionType" type="text" required :disabled="true"></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col md="4">
                    <b-form-group label="Initial:" label-size="sm">
                      <b-form-input v-model="selInspectionInitial" type="text" required :disabled="true"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <!-- DEVICE -->
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="12">
                     <label class="typo__label">Order Device:</label>
                    <multiselect
                        v-model="selOrderDevice" placeholder="Choose Order Device" track-by="id" 
                        :options="orderDevices" :multiple="false" :taggable="true" :close-on-select="true" :searchable="true" 
                        open-direction="bottom" :custom-label="getOrderDeviceLabel">
                    </multiselect>
                  </b-col>
                </b-row>
                <!-- ORDER ITEMS -->
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="12">
                     <label class="typo__label">Order Items:</label>
                    <multiselect
                        v-model="selOrderItems" placeholder="Choose Order Item" track-by="id" 
                        :options="orderItems" :multiple="true" :taggable="true" :close-on-select="false" :searchable="true" 
                        open-direction="bottom" :custom-label="getOrderItemLabel">
                    </multiselect>
                  </b-col>
                </b-row>
                <div class="ml-3 mr-3 mt-3" v-show="selOrderItems.length >= 1">
                  <h5 class="mt-4 ml-4 mr-3">Amount of Samples</h5>
                  <b-row class="ml-3 mr-3 mt-2" v-for="item in selOrderItems" :key="item.id">
                    <b-input-group class="mt-2 ml-3 mr-3" :prepend="`${item.idOrder.txtOrderNumber}  |  ${item.idItem.txtDescription} - ${item.idItem.txtArticleNumber}`" >
                      <b-form-input v-model="item.testAmount" type="number" min=1 required></b-form-input>
                    </b-input-group>
                  </b-row>
                </div>

                <!-- SAMPLES -->
                <div v-if="selectedItemTypes != ''">
                  <b-row md="12" class="ml-5 mr-5 mt-3 mb-3" v-for="element in filteredAttributes" :key="element.id">
                    <h5 class="mb-1">{{ element.type }}</h5>
                    <b-col md="12" v-for="atts in element.attributes" :key="atts.id">
                      <b-form-checkbox-group v-model="selectedAttributes" :options="atts" multiple
                        value-field="id" text-field="txtNameAttribute"></b-form-checkbox-group>
                    </b-col>
                  </b-row>
                </div>

              <!-- NEW INSPECTION BUTTONS -->
              <b-row class="ml-3 mt-5 mr-3">
                <b-col md="6">
                  <b-button @click="emptyInspectionInput" block variant="outline-info">Cancel</b-button>
                </b-col>
                <b-col md="6">
                  <b-button type="submit" block variant="success" :disabled="selOrderItems.length <= 0">Create Inspection</b-button>
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

    <!-- <b-button size="m" variant="warning" block @click="showTempAtts">Show Template Attributes</b-button> -->

    <!-- INSPECTION MODAL -->
    <b-modal id="modal-inspection" hide-footer title="Please Confirm">
      <div class="d-block text-center mt-3 mb-4">
        <p>Are you sure you want to create the Inspection? Please make sure you have checked your selected Items and Device as well as the chosen Inspection Template.</p>
      </div>
      <b-row class="mt-3" >
        <b-col md="6">
          <b-button size="sm" variant="danger" block @click="emptyInspectionInput(); $bvModal.hide('modal-inspection')">No, cancel it!</b-button>
        </b-col>
        <b-col md="6">
          <b-button size="sm" variant="success" block @click="addInspection(); $bvModal.hide('modal-inspection')">Yes, create the inspection.</b-button>
        </b-col>
      </b-row>
    </b-modal>

    <!-- GRID TEMPLATES -->
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
                @row-selected="onRowSelected"
                :masterDetail="true"
                :detailCellRendererParams="detailCellRendererParams"
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
    title: "Template"
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
      rowDataMod: null,
      rowSelection: null,
      defaultColDef: null,
      frameworkComponents: null,
      detailCellRendererParams: null,
      domLayout: null,
      excelStyles: null,
      modules: AllModules,

      // VUE VARIABLES INSPECTION
      orderItems: [],
      orderDevices: [],
      orderItemAttributes: [],
      selInspectionName: null,
      selInspectionType: null,
      selInspectionInitial: null,
      selInspectionTemplate: null,
      selOrderItems: [],
      selOrderDevice: [],
      templateAttributes: [],
      tempAtts: [],
      orderAtts: [],
      inspections: [],
      inspectNumber: null,

      // VUE VARIABLES
      templates: [],
      attributes: [],
      filteredAttributes: [],
      selectedAttributes: [],
      selectedInspectionType: [],
      selectedItemTypes: [],
      show: false,
      show1: false,
      show2: false,
      TempName: null,
      date: null,
      error: false,
      updateStatus: false,
      updateId: null,
      optionItemTypes: [],
      optionInspectionTypes: [],
    };
  },
  beforeMount() {
    this.gridOptions = {};
    this.columnDefs = [
      {headerName: "Template Name", field: "txtInspectionName", filter: 'agTextColumnFilter', cellRenderer: 'agGroupCellRenderer', checkboxSelection: true,},
      {headerName: "Template Type", field: "idInspectionType.txtInspectionType", filter: 'agTextColumnFilter', cellEditor: 'agRichSelectCellEditor', },
      {headerName: "Template Initial", field: "idInspectionType.txtInspectionInitial", filter: 'agTextColumnFilter', cellEditor: 'agRichSelectCellEditor', },
    ],
    this.defaultColDef = { flex: 1, editable: false, resizable: true, sortable: true, filter: true, floatingFilter: true, };
    this.detailCellRendererParams = {
      detailGridOptions: {
        rowSelection: 'single',
        suppressRowClickSelection: true,
        enableRangeSelection: true,
        pagination: true,
        paginationAutoPageSize: 20,
        columnDefs: [
          {headerName: "Item Type", field: "idItemType.txtItemType",},
          {headerName: "Attribute Key", field: "txtKeyAttribute",},
          {headerName: "Attribute Name", field: "txtNameAttribute",},
          {headerName: "Default Value", field: "txtValueDefault",},
          {headerName: "Value Type", field: "txtValueType",},
          {headerName: "Parameter", field: "txtParameter",},
        ],
        defaultColDef: { flex: 1, editable: false, resizable: true, },
      },
      getDetailRowData: params => {
        params.successCallback(params.data.idInspectionTemplateAttribute);
      },
    }
    this.rowSelection = 'single';
    this.domLayout = 'autoHeight';
    this.paginationPageSize = 10;
  },
  mounted() {
    if (window.InspectionTemplateColState)
       this.gridOptions.columnApi.setColumnState(window.InspectionTemplateColState);
    else
      this.gridApi = this.gridOptions.api;
      this.gridColumnApi = this.gridOptions.columnApi;
  },
  computed: {
    disabled: function () {
      return !this.TempName ? true : !this.selectedInspectionType ? true : !this.selectedItemTypes ? true : false; 
    },
  },
  methods: {
    onBtExport() {
      this.gridApi.exportDataAsExcel({});
    },
    onPageSizeChanged(newPageSize) {
      var value = document.getElementById('page-size').value;
      this.gridApi.paginationSetPageSize(Number(value));
    },
    saveState() {
      window.InspectionTemplateColState = this.gridOptions.columnApi.getColumnState();
    },
    restoreState() {
      window.InspectionTemplateColState = null;
    },
    onSubmit() {
      console.log('inspection created!')
    },
    onChange(itemTypes) {
      this.selectedAttributes = null;
      this.filteredAttributes = []
      for (let i = 0; i < itemTypes.length; i++) {
        let el = itemTypes[i];
        let element = { type: null, attributes: [], }
        element['type'] = el.txtItemType;
        element['attributes'].push(this.attributes.filter(e => e.idItemType.txtItemType == el.txtItemType))
        this.filteredAttributes[i] = element;
      }
    },
    onRowSelected(event) {
      this.getOrderItems();
      this.getOrderDevices();
      this.selInspectionName = event.node.data.txtInspectionName;
      this.selInspectionType = event.node.data.idInspectionType.txtInspectionType;
      this.selInspectionInitial = event.node.data.idInspectionType;
      this.selInspectionTemplate = event.node.data.id;
      this.getSelectedTemplateAttributes(event.node.data.id);
      this.getInspectionTemplateAttributes();
      this.getInspectionNumber(event.node.data.idInspectionType.txtInspectionInitial);
      this.show1 = this.show1 ? false : true;
      document.documentElement.scrollTop = 0;
    },
    addInspection() {
      let today = new Date();
      let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      let endpoint = `/api/inspection/`;
      apiService(endpoint, "POST", {
        idOrderDevice: this.selOrderDevice.id, 
        txtInspectionStatus: 'Work In Progress', 
        idInspectionType: this.selInspectionInitial,
        txtInspectionNumber: this.inspectNumber,
      })
      .then(response => {
        if(response != 'ERROR') {
          for (let i = 0; i < this.selOrderItems.length; i++) {
            for (let t = 0; t < this.selOrderItems[i].testAmount; t++) {
              this.addSample(response.id, this.selOrderItems[i])
            }
          }
          this.emptyInspectionInput();
          localStorage.setItem('InspectionID', response.id);
          this.$router.push('inspection/');
        }
      })
      .catch(err => console.log(err));
    },
    addSample(InspectId, OrderItem) {
      let endpoint = `/api/sample/`;
      apiService(endpoint, "POST", { 
        idInspection: InspectId, 
        idOrderItem: OrderItem.id, 
        txtSampleStatus: 'Not Approved', 
      })
      .then(response => {
        if(response != 'ERROR') {
          let el = this.tempAtts.filter(function(e) {return this.indexOf(e.id) != -1}, this.templateAttributes);
          let atts = el.filter(e => e.idItemType === OrderItem.idItem.idItemType);
          this.getSelectedOrderItemAttributes(OrderItem, atts);
          this.addSampleAttribute(response.id, atts)
        }
      })
      .catch(err => console.log(err));
    },
    addSampleAttribute(SampleId, atts) {
      let endpoint = `/api/sample-attribute/`;
      for (let i = 0; i < atts.length; i++) {
        apiService(endpoint, "POST", { 
          txtKeyAttribute: atts[i].txtKeyAttribute, 
          txtNameAttribute: atts[i].txtNameAttribute, 
          txtValueAttribute: atts[i].txtValueDefault, 
          txtValueType: atts[i].txtValueType, 
          txtParameter: atts[i].txtParameter, 
          txtValueMin: atts[i].txtValueMin, 
          txtValueMax: atts[i].txtValueMax, 
          txtValueTolerance: atts[i].txtValueTolerance, 
          idSample: SampleId, 
        })
      }
    },
    getOrderItemLabel(e) {
      return `${e.idOrder.txtOrderNumber}  |  ${e.idItem.txtDescription} - ${e.idItem.txtArticleNumber}`
    },
    getOrderDeviceLabel(e) {
      return `${e.idOrder.txtOrderNumber}  |  ${e.idDevice.idModel.txtModelName} - ${e.idDevice.txtSerialNumber}`
    },
    addTemplate() {
      let endpoint = `/api/inspection-template/`;
      apiService(endpoint, "POST", { 
        txtInspectionName: this.TempName,
        idInspectionType: this.selectedInspectionType.id,
        idInspectionTemplateAttribute: this.selectedAttributes, 
        })
        .then(response => {
          if (response){
            this.getTemplates();
            this.emptyInput();
          }
        })
        .catch(err => console.log(err));
    },
    editTemplateMenu(params) {
      this.emptyInput();
      let sel = params.node.data;
      this.TempName = sel.txtInspectionName;
      this.selectedInspectionType = sel.idInspectionType;
      this.updateStatus = true;
      this.updateId = sel.id;
      this.show = true;
      document.documentElement.scrollTop = 0;
    },
    async updateTemplate() {
      let endpoint = `/api/inspection-template/${this.updateId}/`;
      await apiService(endpoint, "PATCH", { 
        txtInspectionName: this.TempName,
        idInspectionType: this.selectedInspectionType.id })
        .then(response => {
          if (response != 'ERROR'){
            this.emptyInput();
            this.getTemplates();
          }
        })
        .catch(err => console.log(err));
    },
    openModal(params) {
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to delete the selected Template?", {
          title: "Please Confirm", size: "m", buttonSize: "sm", okVariant: "danger", okTitle: "YES",
          cancelTitle: "NO", footerClass: "p-2", hideHeaderClose: false, centered: true })
        .then(value => { if (value) { this.deleteTemplate(params); } })
        .catch(err => console.log(err));
    },
    openModalInspection(params) {
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to create the Inspection? Please make sure you have checked your selected Items as well as the inspection type and Device.", {
          title: "Please Confirm", size: "m", buttonSize: "sm", okVariant: "danger", okTitle: "Yes, create the Inspection.",
          cancelTitle: "No, cancel it!", footerClass: "p-2", hideHeaderClose: false, centered: true })
        .then(value => { 
          if (value) { 
            console.log('Inspection created')
          } else {
            console.log('Inspection cancelled')
            this.emptyInspectionInput();
          }
        })
        .catch(err => console.log(err));
    },
    async deleteTemplate(params) {
      let endpoint = `/api/inspection-template/${params.node.data.id}/`;
      try {
        await apiService(endpoint, "DELETE");
        this.getTemplates();
      }
      catch (err) {
        console.log(err);
      }
    },
    emptyInput(event) {
      this.selectedInspectionType = this.selectedItemTypes = this.ParameterTags = [];
      this.TempName = null;
      this.selectedAttributes = null;
      if(event != 'add') {
        this.show = false;
      } else {
        this.updateStatus = false;
        this.show = !this.show;
      }
    },
    emptyInspectionInput() {
      this.show1 = false;
      this.selInspection = null;
      this.selOrderItems = this.selOrderDevice = [];
      this.getTemplates();
    },
    getTemplates() {
      if (!this.error) {
        this.templates = [];
        let endpoint = `/api/inspection-template-list/`;
        apiService(endpoint)
          .then(data => {
            this.templates.push(...data.results);
            this.rowData = this.templates
          })
          .catch(err => console.log(err));
      }
    },
    getAttributes() {
      if (!this.error) {
        this.attributes = [];
        let endpoint = `/api/inspection-template-attribute-list/`;
        apiService(endpoint)
          .then(data => { this.attributes.push(...data.results); })
          .catch(err => console.log(err));
      }
    },
    showTempAtts() {
      // this.getSelectedTemplateAttributes(2);
      // console.log(this.templateAttributes)
    },
    getSelectedTemplateAttributes(id) {
      let endpoint = `/api/inspection-template/${id}/`;
      apiService(endpoint)
        .then(data => {
          this.templateAttributes.push(...data.idInspectionTemplateAttribute);
        })
        .catch(err => console.log(err));
    },
    getInspectionTemplateAttributes() {
      let endpoint = `/api/inspection-template-attribute/`;
      apiService(endpoint)
        .then(data => {
          this.tempAtts.push(...data.results)
        })
        .catch(err => console.log(err));
    },
    getSelectedOrderItemAttributes(OrderItem, atts) {
      this.orderAtts = this.orderItemAttributes.filter(e => e.idOrderItem === OrderItem.id)
      if(this.orderAtts.length >= 1) {
        let el = atts.map(x => {
          const item = this.orderAtts.find(({ txtKeyAttribute }) => txtKeyAttribute === x.txtKeyAttribute);
          if(item != undefined) {
            x.txtValueDefault = item.txtValueAttribute;
            x.txtParameter = item.txtParameter;
            return x;
          } else {
            return x;
          }
        })
      }
      return atts;
    },
    getItemTypes() {
      if (!this.error) {
        this.optionItemTypes = [];
        let endpoint = `/api/item-type/`;
        apiService(endpoint)
          .then(data => {
            this.optionItemTypes.push(...data.results);
          })
          .catch(err => console.log(err));
      }
    },
    getInspectionTypes() {
      if (!this.error) {
        this.optionInspectionTypes = [];
        let endpoint = `/api/inspection-type/`;
        apiService(endpoint)
          .then(data => {
            this.optionInspectionTypes.push(...data.results);
          })
          .catch(err => console.log(err));
      }
    },
    getOrderItems() {
      this.orderItems = [];
      let endpoint = `/api/order-item-list/`;
      apiService(endpoint)
        .then(data => { this.orderItems.push(...data.results); })
        .catch(err => console.log(err));
    },
    getOrderItemAttributes() {
      this.orderItemAttributes = [];
      let endpoint = `/api/order-item-attribute/`;
      apiService(endpoint)
        .then(data => { this.orderItemAttributes.push(...data.results); })
        .catch(err => console.log(err));
    },
    getOrderDevices() {
      this.orderDevices = [];
      let endpoint = `/api/order-device-list/`;
      apiService(endpoint)
        .then(data => { 
          this.orderDevices.push(...data.results); 
          this.orderDevices = this.orderDevices.filter(e => e.txtDeliveryStatus === 'Delivered')
          })
        .catch(err => console.log(err));
    },
    getInspectionNumber(type) {
      let endpoint = `/api/inspection/`;
      apiService(endpoint)
        .then(data => {
          this.inspections.push(...data.results);
          let d = new Date();
          let y = d.getFullYear();
          let pn = [];
          let value = null;
          for (let i = 0; i < this.inspections.length; i++) {
            let el = this.inspections[i].txtInspectionNumber.split('-');
            let arr = { label: el[0], type: el[1], year: el[2], number: el[3] };
            if(arr.year == y) {
              pn.push(arr);
            }
          }
          pn.sort(function(a, b) {
            const keyA = a.number;
            const keyB = b.number;
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });
          let sequence = String(parseInt(pn[pn.length-1].number) + 1);
          for (let e = sequence.length; e < 4; e++) {
            sequence = '0' + sequence;
          }
          if(parseInt(pn[pn.length-1][2] != y)) {
            value = { label: 'IN', year: y, number: '0001', type: type };
          } else {
            value = { label: 'IN', year: y, number: sequence, type: type };
          }
          this.inspectNumber = value.label + '-' + value.type + '-' + value.year + '-' + value.number;
        })
        .catch(err => console.log(err));
    },
    getDateToday() {
      var today = new Date();
      this.date = today.getDate()+' / '+(today.getMonth()+1)+' / '+today.getFullYear();
    },
    getContextMenu(params) {
      var result = [
        {
          name: 'Edit Template',
          action: () => this.editTemplateMenu(params)
        },
        'separator',
        {
          name: 'Delete Template',
          action: () =>  this.openModal(params)
        },
        'export'
      ];
      return result;
    },
  },
  created() {
    this.getTemplates();
    this.getAttributes();
    this.getDateToday();
    this.getInspectionTypes();
    this.getItemTypes();
    this.getOrderItemAttributes();
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
  #new-template-section {
    cursor: pointer;
    outline: none;
  }
</style>
