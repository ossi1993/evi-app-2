<template>
  <!-- ============ Body content start ============= -->
  <div class="main-content">
    <breadcumb :page="'List Order Items'" :folder="'Order'" />
    <b-row>
      <!-- ICON BG -->
      <b-col lg="6" md="6" sm="12">
        <b-card class="card-icon-bg card-icon-bg-primary o-hidden mb-30 text-center">
          <i class="i-Add-Cart"></i>
          <div class="content">
            <p class="text-muted mt-2 mb-0">Orders</p>
            <p class="inline text-primary text-24 line-height-1 mb-2">{{ this.orders.length }}</p>
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
    <!-- ########### ORDER ITEM SECTION ########## -->
    <!-- ######################################### -->
    <div class="row" v-if="updateItemStatus">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0 mb-3">
            <b-row class="ml-3">
              <i class="nav-icon i-Add mt-3" style="font-size: 20px"></i>
              <h5 class="card-title border-bottom p-3 mb-2">Update Item Order</h5>
            </b-row>
            <div class="mt-3" v-show="show">
              <b-form @submit.prevent="updateItemOrder">
                <!-- ORDER INPUT -->
                <b-row class="mt-4 ml-3 mr-3">
                  <b-col md="4">
                    <v-select v-model="orderedItem" :options="items" required placeholder="Choose Item"
                      :get-option-label="label => label.txtArticleNumber + ' - ' + label.txtDescription"></v-select>
                  </b-col>
                  <b-col md="4">
                    <b-form-datepicker v-model="DatOrder" required placeholder="Order Date" disabled></b-form-datepicker >
                  </b-col>
                  <b-col md="4">
                    <b-form-datepicker v-model="DatDelivery" placeholder="Delivery Date" ></b-form-datepicker >
                  </b-col>
                </b-row>
                <b-row class="mt-3 ml-3 mr-3">
                  <b-col md="4">
                    <b-form-input v-model="OrderAmount" type="number" min=1></b-form-input>
                  </b-col>
                  <b-col md="4">
                    <b-form-select v-model="DelStatus" :options="optionStatus" text-field="label" value-field="code"></b-form-select>
                  </b-col>
                  <b-col md="4">
                    <b-form-select v-model="SupplierReference" :options="optionReference" text-field="label" value-field="code"></b-form-select>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="12">
                    <b-form-textarea v-model="Comment" placeholder="Enter memo ..." rows="3" max-rows="6"></b-form-textarea>
                  </b-col>
                </b-row>
                <!-- NEW ITEM / UPDATE ITEM BUTTONS -->
                <b-row class="ml-3 mr-3 mt-5">
                  <b-col md="6">
                    <b-button @click="emptyItemInput" block variant="outline-info">Cancel</b-button>
                  </b-col>
                  <b-col md="6">
                    <b-button block variant="warning" type="submit">Update Item Order</b-button>
                  </b-col>
                </b-row>
              </b-form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ############################################## -->
    <!-- ########### ORDER ATTRIBUTE SECTION ########## -->
    <!-- ############################################## -->
    <div class="row" v-if="updateAttributeStatus">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0 mb-3">
            <b-row class="ml-3">
              <i class="nav-icon i-Add mt-3" style="font-size: 20px"></i>
              <h5 class="card-title border-bottom p-3 mb-2">Update Item Attribute</h5>
            </b-row>
            <div class="mt-3" v-show="show3">
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
                    label="text" :reduce="Value => Value.value" @input="emptyLastValueType($event)"></v-select>
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
                    <v-select  id="select-5" v-model="ValueAtt" :options="ParameterTags" required placeholder="Choose Attribute Parameter" 
                    label="text" ></v-select>
                  </b-col>
                </b-row>
                
                <!-- UPDATE DEVICE BUTTONS -->
                <b-row class="ml-3 mr-3 mt-5">
                  <b-col md="6">
                    <b-button @click="emptyAttributeInput" block variant="outline-info">Cancel</b-button>
                  </b-col>
                  <b-col md="6">
                    <b-button block variant="warning" type="submit">Update Item Attribute</b-button>
                  </b-col>
                </b-row>
              </b-form>
            </div>
          </div>
        </div>
      </div>
    </div>
   
    <!-- AG-GRID ORDER ITEMS -->
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0">
            <AgGridVue class="ag-theme-alpine"
                id="gridItemOrders"
                :defaultColDef="defaultColDef"
                :columnDefs="columnDefs"
                :rowSelection="rowSelection"
                :rowData="rowData"
                :gridOptions="gridOptions"
                :suppressRowClickSelection="true"
                :excelStyles="excelStyles"
                @cellValueChanged="updateItemOrderGrid"
                @row-selected="onRowSelected"
                :getContextMenuItems="getContextMenu"
                :pagination="true"
                :paginationPageSize="paginationPageSize"
                :domLayout="domLayout"
                :modules="modules"
                :animateRows="true"
                :isExternalFilterPresent="isExternalFilterPresent"
                :doesExternalFilterPass="doesExternalFilterPass">
            </AgGridVue>
            <!-- GRID BUTTONS -->
            <b-row>
              <b-col md="6">
                <div class="ml-3 fmr-3 mt-2 mb-2 text-left">
                  <b-button @click="changeExternalFilter('all')" size="sm" variant="outline-info">Show All</b-button>
                  <b-button @click="changeExternalFilter('delivered')" class="ml-3" size="sm" variant="outline-info">Show Delivered</b-button>
                  <b-button @click="changeExternalFilter('not delivered')" class="ml-3" size="sm" variant="outline-info">Show Not Delivered</b-button>
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
                    <b-button @click="onBtExport" class="ml-3" size="sm" variant="outline-success">Export Excel</b-button>
                </div>
              </b-col>
            </b-row>
          </div>
        </div>
      </div>
    </div>

    <!-- AG-GRID ATTRIBUTES -->
    <div class="row" v-if="rowData1 != null">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0">
            <AgGridVue class="ag-theme-alpine"
                id="gridAttributes"
                :defaultColDef="defaultColDef1"
                :columnDefs="columnDefs1"
                :rowSelection="rowSelection"
                :rowData="rowData1"
                :gridOptions="gridOptions1"
                @grid-ready="onGridReady1"
                @cellValueChanged="updateItemOrderAttributeGrid"
                :pagination="false"
                :suppressRowClickSelection="true"
                :getContextMenuItems="getContextMenu1"
                :domLayout="domLayout"
                :modules="modules">
            </AgGridVue>
            <!-- GRID BUTTONS -->
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

    <!-- AG-GRID STATE -->
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
    title: "Item Orders"
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
      excelStyles: null,
      frameworkComponents: null,
      domLayout: null,
      modules: AllModules,

      // AG-GRID ITEM ATTRIBUTES
      gridOptions1: null,
      gridApi1: null,
      columnApi1: null,
      columnDefs1: null,
      rowData1: null,
      defaultColDef1: null,

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
      optionsBoolean: [
        { value: 'true', text: 'True' },
        { value: 'false', text: 'False' },
      ],

      // VUE VARIABLES
      orders: [],
      attributes: [],
      items: [],
      orderedItem: [],
      show: false,
      show1: false,
      ONumber: null,
      DatOrder: null,
      DatDelivery: null,
      OrderAmount: null,
      DelStatus: null,
      Comment: null,
      SupplierReference: null,
      date: null,
      error: false,
      updateItemStatus: false,
      updateItemId: null,      
      optionStatus: [
        { code: null, label: 'Choose Delivery Status' },
        { code: 'Delivered', label: 'Delivered' },
        { code: 'Not Delivered', label: 'Not Delivered' },
      ],
      optionReference: [
        { code: null, label: 'Choose Supplier Reference' },
        { code: 'Yes', label: 'Yes' },
        { code: 'No', label: 'No' },
      ],
    };
  },
  beforeMount() {
    this.gridOptions = {};
    this.gridOptions1 = {};
    this.columnDefs = [
      {headerName: "Order Number", field: "idOrder.txtOrderNumber", filter: 'agTextColumnFilter', editable: false, checkboxSelection: true, },
      {headerName: "Article Number", field: "idItem.txtArticleNumber", filter: 'agTextColumnFilter', editable: false, },
      {headerName: "Description", field: "idItem.txtDescription", filter: 'agTextColumnFilter', editable: false, },
      {headerName: "Order Amount", field: "numOrderAmount", filter: 'agTextColumnFilter',},
      {headerName: "Order Date", field: "datOrder", filter: 'agTextColumnFilter',},
      {headerName: "Delivery Date", field: "datDelivery", filter: 'agTextColumnFilter',},
      {headerName: "Delivery Status", field: "txtDeliveryStatus", filter: 'agTextColumnFilter', },
      {headerName: "Supplier Reference", field: "txtSupplierReference", filter: 'agTextColumnFilter', },
      {headerName: "Memo", field: "txtComment", filter: 'agTextColumnFilter', },
    ],
    this.columnDefs1 = [
      {headerName: "Key Attribute", field: "txtKeyAttribute", filter: 'agTextColumnFilter', },
      {headerName: "Name Attribute", field: "txtNameAttribute", filter: 'agTextColumnFilter', },
      {headerName: "Value Attribute", field: "txtValueAttribute", filter: 'agTextColumnFilter', },
      {headerName: "Value Type", field: "txtValueType", filter: 'agTextColumnFilter',},
      {headerName: "Parameter", field: "txtParameter", filter: 'agTextColumnFilter',},
    ],
    this.defaultColDef = { flex: 1, editable: true, resizable: true, sortable: true, filter: true, floatingFilter: true, };
    this.defaultColDef1 = { flex: 1, editable: true, resizable: true, sortable: true, filter: true, floatingFilter: true, };
    this.rowSelection = 'single';
    this.domLayout = 'autoHeight';
    this.paginationPageSize = 10;
  },
  mounted() {
    if (JSON.parse(localStorage.getItem('orderItem_columnStats')) != null) {
       this.gridOptions.columnApi.setColumnState(JSON.parse(localStorage.getItem('orderItem_columnStats')));
    } else {
      this.gridApi = this.gridOptions.api;
      this.gridColumnApi = this.gridOptions.columnApi;
    }
  },
  methods: {
    saveState() {
      localStorage.setItem('orderItem_columnStats', JSON.stringify(this.gridOptions.columnApi.getColumnState()));
    },
    restoreState() {
      localStorage.setItem('orderItem_columnStats', null);
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
    onBtExport() {
      this.gridApi.exportDataAsExcel({});
    },
    onPageSizeChanged(newPageSize) {
      var value = document.getElementById('page-size').value;
      this.gridApi.paginationSetPageSize(Number(value));
    },
    onRowSelected(event) {
      this.rowData1 = null;
      if(event.node.selected == true) {
        this.getItemOrderAttributes(event.data.id);
      }
    },
    onGridReady1(params) {
      this.gridApi1 = params.api;
      this.gridColumnApi1 = params.columnApi
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
        case 'delivered':
          return node.data.txtDeliveryStatus === 'Delivered';
        case 'not delivered':
          return node.data.txtDeliveryStatus === 'Not Delivered';
        default:
          return true;
      }
    },
    editOrderItemMenu(params) {
      this.emptyItemInput();
      let sel = params.node.data;
      this.orderedItem = sel.idItem;
      this.DatOrder = sel.datOrder;
      this.DatDelivery = sel.datDelivery;
      this.OrderAmount = sel.numOrderAmount;
      this.DelStatus = sel.txtDeliveryStatus;
      this.SupplierReference = sel.txtSupplierReference;
      this.Comment = sel.txtComment;
      this.updateItemStatus = true;
      this.updateItemId = sel.id;
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
      this.show3 = true;
      document.documentElement.scrollTop = 0;
    },
    async updateItemOrder() {
      let endpoint = `/api/order-item/${this.updateItemId}/`;
      await apiService(endpoint, "PATCH", {
        datOrder: this.DatOrder,
        datDelivery: this.DatDelivery,
        numOrderAmount: this.OrderAmount,
        txtDeliveryStatus: this.DelStatus,
        txtSupplierReference: this.SupplierReference, 
        txtComment: this.Comment, 
        idItem: this.orderedItem.id })
          .then(response => {
            this.getItemOrder();
            this.emptyItemInput();
          })
    },
    async updateItemAttribute() {
      let endpoint = `/api/order-item-attribute/${this.updateAttributeId}/`;
      await apiService(endpoint, "PATCH", { txtParameter: this.setParameter(), txtKeyAttribute: this.KeyAtt,
        txtNameAttribute: this.NameAtt, txtValueAttribute: this.ValueAtt, txtValueType: this.ValueType, })
        .then(response => {
          if (response != 'ERROR'){
            this.getItemOrder();
            this.emptyAttributeInput();
            this.rowData = null;
            this.rowData1 = null;
            this.error = false;
          } else {
            this.error = true;
          }
        })
        .catch(err => console.log(err));
    },
    async updateItemOrderGrid(event) {     
      let endpoint = `/api/order-item/${event.node.data.id}/`;
      try {
        await apiService(endpoint, "PATCH", { 
          datOrder: event.node.data.datOrder,
          datDelivery: event.node.data.datDelivery,
          numOrderAmount: event.node.data.numOrderAmount,
          txtSupplierReference: event.node.data.txtSupplierReference,
          txtComment: event.node.data.txtComment,
        })
        .catch(err => console.log(err));
      }
      catch (err) { console.log(err) }
    },
    async updateItemOrderAttributeGrid(event) {     
      let endpoint = `/api/order-item-attribute/${event.node.data.id}/`;
      try {
        await apiService(endpoint, "PATCH", { 
          txtKeyAttribute: event.node.data.txtKeyAttribute,
          txtNameAttribute: event.node.data.txtNameAttribute,
          txtValueDefault: event.node.data.txtValueDefault,
          txtValueType: event.node.data.txtValueType,
          txtParameter: event.node.data.txtParameter,
        })
        .catch(err => console.log(err));
      }
      catch (err) { console.log(err) }
    },
    openModal(params) {
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to delete the selected Order? => " + params.node.data.idItem.txtDescription, {
          title: "Please Confirm", size: "m", buttonSize: "sm", okVariant: "danger",
          okTitle: "YES", cancelTitle: "NO", footerClass: "p-2", hideHeaderClose: false, centered: true })
        .then(value => { if (value) { this.deleteOrder(params); } })
        .catch(err => console.log(err));
    },
    openModal1(params) {
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to delete the selected Item Order Attribute?", {
          title: "Please Confirm", size: "m", buttonSize: "sm", okVariant: "danger",
          okTitle: "YES", cancelTitle: "NO", footerClass: "p-2", hideHeaderClose: false, centered: true })
        .then(value => { if (value) { this.deleteItemOrderAttribute(params); } })
        .catch(err => console.log(err));
    },
    async deleteOrder(params) {
      let endpoint = `/api/order-item/${params.node.data.id}/`;
      await apiService(endpoint, "DELETE")
        .then(response => {
          if (response != 'ERROR') {
            this.getItemOrder();
            this.rowData1 = null;
          } else {
            this.$bvToast.toast(`You can't delete this instance. Please check if all connections to this instance are deleted.`, {
              title: 'DELETE WARNING', variant: 'danger', autoHideDelay: 6000, appendToast: false
            })
          }
        })
    },
    async deleteItemOrderAttribute(params) {
      let endpoint = `/api/order-item-attribute/${params.node.data.id}/`;
      await apiService(endpoint, "DELETE")
        .then(response => {
          if (response != 'ERROR') {
            this.getItemOrder();
            this.rowData1 = null;
          } else {
            this.$bvToast.toast(`You can't delete this instance. Please check if all connections to this instance are deleted.`, {
              title: 'DELETE WARNING', variant: 'danger', autoHideDelay: 6000, appendToast: false
            })
          }
        })
    },
    emptyItemInput(event) {
      this.DatOrder = this.DatDelivery = this.OrderAmount = this.DelStatus = this.Comment = null;
      this.SupplierReference = false;
      this.orderedItem = [];
      this.show = !this.show;
      this.updateItemStatus = false;
    },
    emptyAttributeInput(event) {
      this.KeyAtt = this.NameAtt = this.ValueAtt = this.ValueType = this.Parameter = null;
      this.ParameterTags = [];
      this.show3 = !this.show3;
      this.updateAttributeStatus = false;
    },
    getItem() {
      if (!this.error) {
        this.items = [];
        let endpoint = `/api/item/`;
        apiService(endpoint)
          .then(data => {
            this.items.push(...data.results);
          })
          .catch(err => console.log(err));
      }
    },
    getItemOrder() {
      if (!this.error) {
        this.orders = [];
        let endpoint = `/api/order-item-list/`;
        apiService(endpoint)
          .then(data => {
            this.orders.push(...data.results);
            this.rowData = this.orders;
          })
          .catch(err => console.log(err));
      }
    },
    getItemOrderAttributes(OrderItemId) {
      if (!this.error) {
        this.attributes = [];
        let endpoint = `/api/order-item-attribute/`;
        apiService(endpoint)
          .then(data => {
            this.attributes.push(...data.results);
            this.rowData1 = this.attributes.filter(e => e.idOrderItem == OrderItemId);
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
          name: 'Edit Order Item',
          action: () => this.editOrderItemMenu(params)
        },
        'separator',
        {
          name: 'Delete Order Item',
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
          name: 'Delete Item Order Attribute',
          action: () =>  this.openModal1(params)
        },
        'separator',
        'export'
      ];
      return result;
    },
  },
  created() {
    this.getItemOrder();
    this.getDateToday();
    this.getItem();
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
  #new-supplier-section {
    cursor: pointer;
    outline: none;
  }
</style>
