<template>
  <!-- ============ Body content start ============= -->
  <div class="main-content">
    <breadcumb :page="'List Orders'" :folder="'Order'" />
    <!-- ICON BG -->
    <b-row>
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
    
    <!-- #################################### -->
    <!-- ########### ORDER SECTION ########## -->
    <!-- #################################### -->
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0 mb-3">
            <b-row class="ml-3">
              <i class="nav-icon i-Add mt-3" style="font-size: 20px" id="new-order-section" @click="emptyInput('add')"></i>
              <h5 class="card-title border-bottom p-3 mb-2">New Order</h5>
            </b-row>
            <div class="mt-3" v-show="show">
              <b-form @submit.prevent="onSubmit">
                <!-- ORDER INPUT -->
                <b-row class="mt-4 ml-3 mr-3">
                  <b-col md="12">
                    <v-select  id="select-1" v-model="OType" :options="optionType" required placeholder="Choose Order Type" 
                    :disabled="updateStatus" :reduce="OType => OType.code"></v-select>
                  </b-col>
                </b-row>
                <b-row class="mt-3 ml-3 mr-3" v-if="OType == 'Customer'">
                  <b-col md="12">
                    <b-form-input id="input-1" v-model="CNumber" type="text" placeholder="Charge Number" ></b-form-input>
                  </b-col>
                </b-row>
                <b-row class="mt-3 ml-3 mr-3">
                  <b-col md="4">
                    <b-form-input id="input-2" v-model="ONumber" type="text" placeholder="Order Number" ></b-form-input>
                  </b-col>
                  <b-col md="4">
                    <b-form-datepicker id="date-1" v-model="DatOrder" type="text" placeholder="Order Date" ></b-form-datepicker >
                  </b-col>
                  <b-col md="4">
                    <b-form-datepicker id="date-2" v-model="DatDelivery" type="text" placeholder="Delivery Date" ></b-form-datepicker >
                  </b-col>
                </b-row>
                <b-row class="mt-3 ml-3 mr-3 mb-4">
                  <b-col md="6">
                    <v-select id="select-3" v-model="Supplier" :options="optionSupplier" label="txtSupplierName" required placeholder="Choose Supplier" 
                    :reduce="Supplier => Supplier.id"></v-select>
                  </b-col>
                  <b-col md="6">
                    <v-select id="select-2" v-model="DelStatus" :options="optionStatus" placeholder="Choose Delivery Status" 
                    :reduce="DelStatus => DelStatus.code" :disabled="disabledDelivery"></v-select>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="12">
                    <b-form-textarea id="area-1" v-model="Comment" placeholder="Enter memo ..." rows="3" max-rows="6"></b-form-textarea>
                  </b-col>
                </b-row>

                <!-- ADD ITEMS -->
                <div>
                  <b-row class="ml-3 mr-3 mt-3 border-top" v-if="OType == 'Sample Item'">
                    <b-col md="12">
                      <h5 class="typo__label mt-4 mb-3">Add Items to Order</h5>
                      <multiselect
                        v-model="selectedItems" tag-placeholder="Choose Items" placeholder="Search or add a item" label="txtDescription" 
                        track-by="id" :options="optionItems" :multiple="true" :taggable="true" :close-on-select="false"
                        :searchable="true" open-direction="bottom" :custom-label="customItemLabel">
                      </multiselect>
                    </b-col>
                  </b-row>
                  <div class="ml-3 mr-3 mt-3" v-show="selectedItems != null">
                    <h5 class="mt-4 ml-4 mr-3">Order Amount of Items</h5>
                    <b-row class="ml-3 mr-3 mt-2" v-for="item in selectedItems" :key="item.id">
                      <b-input-group class="mt-2 ml-3 mr-3" :prepend="item.txtArticleNumber + ' - ' + item.txtDescription" >
                        <b-form-input v-model="item.numOrderAmount" type="number" min=1 required></b-form-input>
                      </b-input-group>
                    </b-row>
                  </div>
                </div>

                <!-- UPDATE ITEMS -->
                <b-row class="mt-4 ml-3 mr-3 border-top" v-if="OType == 'Sample Item' && updateStatus">
                  <b-col md="12">
                    <h5 class="typo__label mt-4 mb-3">Items of Order</h5>
                    <b-row v-for="item in filteredItems" :key="item.id">
                      <b-input-group class="mt-2 ml-3 mr-3" :prepend="item.idItem.txtArticleNumber  + ' - ' + item.idItem.txtDescription">
                        <b-form-input v-model="item.numOrderAmount" type="number" min=1 required></b-form-input>
                      </b-input-group>
                    </b-row>
                  </b-col>
                </b-row>

                <!-- ADD DEVICES -->
                <div>
                  <b-row class="ml-3 mr-3 mt-3 border-top" v-if="OType == 'Sample Device'">
                    <b-col md="12">
                      <h5 class="typo__label mt-4 mb-3">Add Devices to Order</h5>
                      <multiselect
                        v-model="selectedDevices" tag-placeholder="Choose Devices" placeholder="Search or add a device" label="txtSerialNumber" 
                        track-by="id" :options="optionDevices" :multiple="true" :taggable="true" :close-on-select="false"
                        :searchable="true" open-direction="bottom" :custom-label="customDeviceLabel">
                      </multiselect>
                    </b-col>
                  </b-row>
                  <div class="ml-3 mr-3 mt-3" v-show="selectedDevices != null">
                    <h5 class="mt-4 ml-4 mr-3">Order Amount of Devices</h5>
                    <b-row class="ml-3 mr-3 mt-2" v-for="device in selectedDevices" :key="device.id">
                      <b-input-group class="mt-2 ml-3 mr-3" :prepend="device.idModel.txtModelName + ' - ' + device.txtSerialNumber" >
                        <b-form-input v-model="device.numOrderAmount" type="number" min=1 required></b-form-input>
                      </b-input-group>
                    </b-row>
                  </div>
                </div>

                <!-- UPDATE DEVICES -->
                <b-row class="mt-4 ml-3 mr-3 border-top" v-if="OType == 'Sample Device' && updateStatus">
                  <b-col md="12">
                    <h5 class="typo__label mt-4 mb-3">Devices of Order</h5>
                    <b-row v-for="device in filteredDevices" :key="device.id">
                      <b-input-group class="mt-2 ml-3 mr-3" :prepend="device.idDevice.idModel.txtModelName + ' - ' + device.idDevice.txtSerialNumber">
                        <b-form-input v-model="device.numOrderAmount" type="number" min=1 required></b-form-input>
                      </b-input-group>
                    </b-row>
                  </b-col>
                </b-row>

                <!-- CUSTOMER -->
                <b-row class="mt-4 ml-3 mr-3 border-top" v-if="OType == 'Customer'">
                  <b-col md="12">
                    <h1 class="mt-4 mb-3">NOT IMPLEMENTED YET</h1>
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
                    <b-button block variant="success" :disabled="disabled" type="submit">Add Order</b-button>
                  </b-col>
                  <b-col md="6" v-else-if="updateStatus">
                    <b-button block variant="warning" :disabled="disabled" type="submit">Update Order</b-button>
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
            <div class="mt-3" v-show="show1">
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

    <!-- ########################################### -->
    <!-- ########### ORDER DEVICE SECTION ########## -->
    <!-- ########################################### -->
    <div class="row" v-if="updateDeviceStatus">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0 mb-3">
            <b-row class="ml-3">
              <i class="nav-icon i-Add mt-3" style="font-size: 20px"></i>
              <h5 class="card-title border-bottom p-3 mb-2">Update Device Order</h5>
            </b-row>
            <div class="mt-3" v-show="show2">
              <b-form @submit.prevent="updateDeviceOrder">
                <!-- ORDER INPUT -->
                <b-row class="mt-4 ml-3 mr-3">
                  <b-col md="4">
                    <v-select v-model="orderedDevice" :options="devices" required placeholder="Choose Device"
                      :get-option-label="label => label.idModel.txtModelName + ' - ' + label.txtSerialNumber"></v-select>
                  </b-col>
                  <b-col md="4">
                    <b-form-datepicker v-model="DatOrder" placeholder="Order Date" required disabled></b-form-datepicker >
                  </b-col>
                  <b-col md="4">
                    <b-form-datepicker v-model="DatDelivery" placeholder="Delivery Date" ></b-form-datepicker >
                  </b-col>
                </b-row>
                <b-row class="mt-3 ml-3 mr-3">
                  <b-col md="6">
                    <b-form-input v-model="OrderAmount" type="number" min=1 required></b-form-input>
                  </b-col>
                  <b-col md="6">
                    <b-form-select v-model="DelStatus" :options="optionStatus" text-field="label" value-field="code"></b-form-select>
                  </b-col>
                </b-row>
                <b-row class="ml-3 mr-3 mt-3">
                  <b-col md="12">
                    <b-form-textarea v-model="Comment" placeholder="Enter memo ..." rows="3" max-rows="6"></b-form-textarea>
                  </b-col>
                </b-row>
                <!-- UPDATE DEVICE BUTTONS -->
                <b-row class="ml-3 mr-3 mt-5">
                  <b-col md="6">
                    <b-button @click="emptyDeviceInput" block variant="outline-info">Cancel</b-button>
                  </b-col>
                  <b-col md="6">
                    <b-button block variant="warning" type="submit">Update Device Order</b-button>
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

    <!-- AG-GRID ORDERS -->
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0">
            <h5 class="card-title p-3 pb-0 mb-3">Orders</h5>
            <AgGridVue class="ag-theme-alpine"
                id="gridOrders"
                :defaultColDef="defaultColDef"
                :columnDefs="columnDefs"
                :rowSelection="rowSelection"
                :rowData="rowData"
                :gridOptions="gridOptions"
                :suppressRowClickSelection="true"
                :excelStyles="excelStyles"
                @grid-ready="onGridReady"
                @cellValueChanged="updateOrderGrid"
                @row-selected="onRowSelected"
                :masterDetail="true"
                :detailCellRendererParams="detailCellRendererParams"
                :pagination="true"
                :paginationPageSize="paginationPageSize"
                :getContextMenuItems="getContextMenu"
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

    <!-- AG-GRID ITEMS -->
    <div class="row" v-if="rowData1 != null">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0">
            <h5 class="card-title p-3 pb-0 mb-3">Order Items</h5>
            <AgGridVue class="ag-theme-alpine"
                id="gridItems"
                :defaultColDef="defaultColDef1"
                :columnDefs="columnDefs1"
                :rowSelection="rowSelection"
                :rowData="rowData1"
                :gridOptions="gridOptions1"
                @grid-ready="onGridReady1"
                @row-selected="onRowSelectedAttribute"
                :pagination="false"
                :suppressRowClickSelection="true"
                :getContextMenuItems="getContextMenu1"
                :domLayout="domLayout"
                :modules="modules">
            </AgGridVue>
          </div>
        </div>
      </div>
    </div>

    <!-- AG-GRID DEVICES -->
    <div class="row" v-if="rowData2 != null">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0">
            <h5 class="card-title p-3 pb-0 mb-3">Order Devices</h5>
            <AgGridVue class="ag-theme-alpine"
                id="gridDevices"
                :defaultColDef="defaultColDef2"
                :columnDefs="columnDefs2"
                :rowSelection="rowSelection"
                :rowData="rowData2"
                :gridOptions="gridOptions2"
                @grid-ready="onGridReady2"
                :pagination="false"
                :suppressRowClickSelection="true"
                :getContextMenuItems="getContextMenu2"
                :domLayout="domLayout"
                :modules="modules">
            </AgGridVue>
          </div>
        </div>
      </div>
    </div>

    <!-- AG-GRID ATTRIBUTES -->
    <div class="row" v-if="rowData3 != null">
      <div class="col-md-12">
        <div class="card mb-30">
          <div class="card-body p-0">
            <AgGridVue class="ag-theme-alpine"
                id="gridAttributes"
                :defaultColDef="defaultColDef3"
                :columnDefs="columnDefs3"
                :rowData="rowData3"
                :gridOptions="gridOptions3"
                @grid-ready="onGridReady3"
                @cellValueChanged="updateItemOrderAttributeGrid"
                :pagination="false"
                :suppressRowClickSelection="true"
                :getContextMenuItems="getContextMenu3"
                :domLayout="domLayout"
                :modules="modules">
            </AgGridVue>
            <!-- GRID BUTTONS -->
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
    title: "Orders"
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
      detailCellRendererParams: null,
      domLayout: null,
      modules: AllModules,
      paginationPageSize: null,

      // AG-GRID ITEM VARIABLES
      gridOptions1: null,
      gridApi1: null,
      columnApi1: null,
      columnDefs1: null,
      rowData1: null,
      defaultColDef1: null,

      // AG-GRID DEVICE VARIABLES
      gridOptions2: null,
      gridApi2: null,
      columnApi2: null,
      columnDefs2: null,
      rowData2: null,
      defaultColDef2: null,

      // AG-GRID ITEM ATTRIBUTES VARIABLES
      gridOptions3: null,
      gridApi3: null,
      columnApi3: null,
      columnDefs3: null,
      rowData3: null,
      defaultColDef3: null,

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

      // VUE GENERAL VARIABLES
      suppliers: [],
      items: [],
      devices: [],
      orderItems: [],
      orderDevices: [],
      itemAttributes: [],
      filteredItemAttributes: [],
      orderItemAttributes: [],
      orders: [],
      show: false,
      show1: false,
      show2: false,
      show3: false,
      name: null,
      ONumber: null,
      DatOrder: null,
      DatDelivery: null,
      OType: null,
      CNumber: null,
      DelStatus: null,
      Supplier: null,
      Comment: null,
      OrderAmount: null,
      SupplierReference: false,
      orderedItem: null,
      orderedDevice: null,
      filteredItems: null,
      filteredDevices: null,
      selectedItems: null,
      selectedDevices: null,
      selectedOrderDevice: false,
      date: null,
      error: false,
      updateStatus: false,
      updateItemStatus: false,
      updateDeviceStatus: false,
      updateId: null,
      updateItemId: null,
      updateDeviceId: null,
      extFilter: null,
      optionSupplier: [],
      optionItems: [],
      optionDevices: [],
      optionType: [
        { code: 'Sample Item', label: 'Sample Item' },
        { code: 'Sample Device', label: 'Sample Device' },
        { code: 'Customer', label: 'Customer' },
      ],
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
    this.gridOptions2 = {};
    this.gridOptions3 = {};
    this.rowSelection = 'single';
    this.domLayout = 'autoHeight';
    this.paginationPageSize = 10;
    this.defaultColDef = { editable: true, resizable: true, sortable: true, filter: true, floatingFilter: true, };
    this.defaultColDef1 = { flex: 1, editable: false, resizable: true, sortable: true, filter: true, floatingFilter: true, };
    this.defaultColDef2 = { flex: 1, editable: false, resizable: true, sortable: true, filter: true, floatingFilter: true, };
    this.defaultColDef3 = { flex: 1, editable: false, resizable: true, sortable: true, filter: true, floatingFilter: true, };
    this.columnDefs = [
      {headerName: "Order Number", field: "txtOrderNumber", filter: 'agTextColumnFilter', checkboxSelection: true,},
      {headerName: "Order Date", field: "datOrder", filter: 'agTextColumnFilter', editable: false},
      {headerName: "Delivery Date", field: "datDelivery", filter: 'agTextColumnFilter', editable: false},
      {headerName: "Order Type", field: "txtOrderType", filter: 'agTextColumnFilter', cellEditor: 'agRichSelectCellEditor', cellEditorParams: { cellHeight: 50, values: ['Sample Item', 'Sample Device', 'Customer']}},
      {headerName: "Charge Number", field: "txtChargeNumber", filter: 'agTextColumnFilter',},
      {headerName: "Delivery Status", field: "txtDeliveryStatus", filter: 'agTextColumnFilter', cellEditor: 'agRichSelectCellEditor', cellEditorParams: { cellHeight: 50, values: ['Delivered', 'Not Delivered']}},
      {headerName: "Supplier", field: "idSupplier.txtSupplierName", filter: 'agTextColumnFilter', editable: false},
      {headerName: "Memo", field: "txtComment", filter: 'agTextColumnFilter', },
    ],
    this.columnDefs1 = [
      {headerName: "Article Number", field: "idItem.txtArticleNumber", filter: 'agTextColumnFilter', checkboxSelection: true,},
      {headerName: "Description", field: "idItem.txtDescription", filter: 'agTextColumnFilter', },
      {headerName: "Order Amount", field: "numOrderAmount", filter: 'agTextColumnFilter', },
      {headerName: "Order Date", field: "datOrder", filter: 'agTextColumnFilter', },
      {headerName: "Delivery Date", field: "datDelivery", filter: 'agTextColumnFilter', },
      {headerName: "Delivery Status", field: "txtDeliveryStatus", filter: 'agTextColumnFilter', },
      {headerName: "Supplier Reference", field: "txtSupplierReference", filter: 'agTextColumnFilter', },
      {headerName: "Memo", field: "txtComment", filter: 'agTextColumnFilter', },
    ]
    this.columnDefs2 = [
      {headerName: "Serial Number", field: "idDevice.txtSerialNumber", filter: 'agTextColumnFilter', },
      {headerName: "Model Name", field: "idDevice.idModel.txtModelName", filter: 'agTextColumnFilter', },
      {headerName: "Order Amount", field: "numOrderAmount", filter: 'agTextColumnFilter', },
      {headerName: "Order Date", field: "datOrder", filter: 'agTextColumnFilter', },
      {headerName: "Delivery Date", field: "datDelivery", filter: 'agTextColumnFilter', },
      {headerName: "Delivery Status", field: "txtDeliveryStatus", filter: 'agTextColumnFilter', },
      {headerName: "Memo", field: "txtComment", filter: 'agTextColumnFilter', },
    ]
    this.columnDefs3 = [
      {headerName: "Key Attribute", field: "txtKeyAttribute", filter: 'agTextColumnFilter', },
      {headerName: "Name Attribute", field: "txtNameAttribute", filter: 'agTextColumnFilter', },
      {headerName: "Value Attribute", field: "txtValueAttribute", filter: 'agTextColumnFilter', },
      {headerName: "Value Type", field: "txtValueType", filter: 'agTextColumnFilter',},
      {headerName: "Parameter", field: "txtParameter", filter: 'agTextColumnFilter',},
    ]
  },
  mounted() {
    if (JSON.parse(localStorage.getItem('orders_columnStats')) != null) {
       this.gridOptions.columnApi.setColumnState(JSON.parse(localStorage.getItem('orders_columnStats')));
    } else {
      this.gridApi = this.gridOptions.api;
      this.gridColumnApi = this.gridOptions.columnApi;
    }
  },
  computed: {
    disabled: function () {
      if(this.OType == 'Sample Item' && this.updateStatus != true) {
        return !this.Supplier ? true : !this.ONumber ? true : !this.DatOrder ? true : !this.OType ? true : !this.selectedItems ? true : false; 
      } else if(this.OType == 'Sample Device' && this.updateStatus != true) {
        return !this.Supplier ? true : !this.ONumber ? true : !this.DatOrder ? true : !this.OType ? true : !this.selectedDevices? true : false; 
      } else {
        return !this.Supplier ? true : !this.ONumber ? true : !this.DatOrder ? true : !this.OType ? true : false; 
      }
    },
    disabledDelivery: function () {
      return !this.DatDelivery ? true : false
    },
  },
  methods: {
    saveState() {
      localStorage.setItem('orders_columnStats', JSON.stringify(this.gridOptions.columnApi.getColumnState()));
    },
    restoreState() {
      localStorage.setItem('orders_columnStats', null);
    },
    customItemLabel({ txtArticleNumber, txtDescription, txtVersion }) {
      return `${txtArticleNumber} - ${txtDescription} - v${txtVersion}`
    },
    customDeviceLabel({ idModel, txtSerialNumber, txtDevicePosition }) {
      return `${idModel.txtModelName} - ${txtSerialNumber} - ${txtDevicePosition}`
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
    onSubmit() {
      if(!this.updateStatus) { this.addOrder();
      } else { this.updateOrder(); }
    },
    onPageSizeChanged(newPageSize) {
      var value = document.getElementById('page-size').value;
      this.gridApi.paginationSetPageSize(Number(value));
    },
    onRowSelected(event) {
      this.rowData1 = null;
      this.rowData2 = null;
      if(event.node.selected == true) {
        if(event.data.txtOrderType == 'Sample Item') {
          this.getOrderItem(event.data.id);
        } else if(event.data.txtOrderType == 'Sample Device') {
          this.getOrderDevice(event.data.id);
        }
      }
    },
    onRowSelectedAttribute(event) {
      this.rowData3 = null;
      if(event.node.selected == true) {
        this.getOrderItemAttributes(event.data.id);
      }
    },
    onGridReady(params) {
      setTimeout(() => { this.getSelectedOrder(params) }, 500);
    },
    onGridReady1(params) {
      this.gridApi1 = params.api;
      this.gridColumnApi1 = params.columnApi
    },
    onGridReady2(params) {
      this.gridApi2 = params.api;
      this.gridColumnApi2 = params.columnApi
    },
    onGridReady3(params) {
      this.gridApi3 = params.api;
      this.gridColumnApi3 = params.columnApi
    },
    addOrder() {
      let endpoint = `/api/order/`;
      apiService(endpoint, "POST", { txtOrderNumber: this.ONumber, datOrder: this.DatOrder, datDelivery: this.DatDelivery, 
        txtOrderType: this.OType, txtChargeNumber: null, txtDeliveryStatus: this.DelStatus, txtComment: this.Comment, idSupplier: this.Supplier })
        .then(response => {
          if (this.OType == 'Sample Item' && response != 'ERROR') {
            for (let i = 0; i < this.selectedItems.length; i++) {
              let el = this.selectedItems[i];
              this.addOrderItem(response, el);
            }
          } else if (this.OType == 'Sample Device' && response != 'ERROR') {
            for (let i = 0; i < this.selectedDevices.length; i++) {
              let el = this.selectedDevices[i];
              this.addOrderDevice(response, el);
            }
          }
          this.getOrder();
          this.emptyInput();
          })
          .catch(err => console.log(err));
    },
    addOrderItem(response, el) {
      this.getItemAttributes(el.id);
      let endpoint = `/api/order-item/`;
      apiService(endpoint, "POST", { datOrder: this.DatOrder, datDelivery: this.DatDelivery, numOrderAmount: parseInt(el.numOrderAmount), 
        txtDeliveryStatus: this.DelStatus, idItem: el.id, idOrder: response.id, })
      .then(response => {
        for (let e = 0; e < this.filteredItemAttributes.length; e++) {
          let ia = this.filteredItemAttributes[e];
          this.addOrderItemAttribute(response, ia);
        }
      })
      .catch(err => console.log(err));
    },
    addOrderItemAttribute(response, ia) {
      let endpoint = `/api/order-item-attribute/`;
      apiService(endpoint, "POST", { 
        txtKeyAttribute: ia.txtKeyAttribute, 
        txtNameAttribute: ia.txtNameAttribute, 
        txtValueAttribute: ia.txtValueAttribute, 
        txtValueType: ia.txtValueType, 
        txtParameter: ia.txtParameter, 
        idOrderItem: response.id, })
    },
    addOrderDevice(response, el) {
      let endpoint = `/api/order-device/`;
      apiService(endpoint, "POST", { datOrder: this.DatOrder, datDelivery: this.DatDelivery, numOrderAmount: parseInt(el.numOrderAmount), 
        txtDeliveryStatus: this.DelStatus, idDevice: el.id, idOrder: response.id, })
      .catch(err => console.log(err));
    },
    fillEditorFields(sel) {
      this.DatOrder = sel.datOrder;
      this.DatDelivery = sel.datDelivery;
      this.DelStatus = sel.txtDeliveryStatus;
      this.Comment = sel.txtComment;
    },
    editOrderMenu(params) {
      this.emptyInput();
      this.getOrderItem();
      this.getOrderDevice();
      let sel = params.node.data;
      this.fillEditorFields(sel);
      this.ONumber = sel.txtOrderNumber;
      this.OType = sel.txtOrderType;
      this.CNumber = sel.txtChargeNumber;
      this.Supplier = sel.idSupplier;
      this.updateStatus = true;
      this.updateId = sel.id;
      this.show = true;
      document.documentElement.scrollTop = 0;
    },
    editOrderItemMenu(params) {
      this.emptyItemInput();
      let sel = params.node.data;
      this.fillEditorFields(sel);
      this.orderedItem = sel.idItem;
      this.OrderAmount = sel.numOrderAmount;
      this.SupplierReference = sel.txtSupplierReference;
      this.updateItemStatus = true;
      this.updateItemId = sel.id;
      this.show1 = true;
      document.documentElement.scrollTop = 0;
    },
    editOrderDeviceMenu(params) {
      this.emptyItemInput();
      let sel = params.node.data;
      this.fillEditorFields(sel);
      this.orderedDevice = sel.idDevice;
      this.OrderAmount = sel.numOrderAmount;
      this.updateDeviceStatus = true;
      this.updateDeviceId = sel.id;
      this.show2 = true;
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
    async updateOrderGrid(event) {     
      let endpoint = `/api/order/${event.node.data.id}/`;
      try {
        await apiService(endpoint, "PATCH", { 
          txtOrderNumber: event.node.data.txtOrderNumber,
          datOrder: event.node.data.datOrder,
          datDelivery: event.node.data.datDelivery,
          txtOrderType: event.node.data.txtOrderType,
          txtChargeNumber: event.node.data.txtChargeNumber,
          txtDeliveryStatus: event.node.data.txtDeliveryStatus,
          txtComment: event.node.data.txtComment,
        })
      }
      catch (err) {
        console.log(err)
      }
    },
    async updateItemOrderAttributeGrid(event) {     
      let endpoint = `/api/order-item-attribute/${event.node.data.id}/`;
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
      catch (err) { console.log(err) }
    },
    async updateOrder() {
      let endpoint = `/api/order/${this.updateId}/`;
      await apiService(endpoint, "PATCH", { txtOrderNumber: this.ONumber, datOrder: this.DatOrder, datDelivery: this.DatDelivery, txtOrderType: this.OType,
        txtChargeNumber: this.CNumber, txtDeliveryStatus: this.DelStatus, txtComment: this.Comment, idSupplier: this.Supplier.id })
        .then(response => {
          if (this.OType == 'Sample Item' && response != 'ERROR') {
            if(this.selectedItems === true || this.selectedItems !== null) {
              for (let i = 0; i < this.selectedItems.length; i++) {
                let el = this.selectedItems[i];
                this.addOrderItem(response, el);
              };
            }
            if(this.filteredItems || this.filteredItems != null) {
              for (let i = 0; i < this.filteredItems.length; i++) {
                let el = this.filteredItems[i];
                let endpointItem = `/api/order-item/${el.id}/`;
                apiService(endpointItem, "PATCH", { datOrder: this.DatOrder, datDelivery: null, numOrderAmount: parseInt(el.numOrderAmount), 
                txtDeliveryStatus: this.DelStatus, txtSupplierReference: null, txtComment: null, idItem: el.id, idOrder: response.id })
              };
            }
            this.getOrder();
            this.emptyInput();
          } else if (this.OType == 'Sample Device' && response != 'ERROR') {
            if(this.selectedDevices || this.selectedDevices != null) {
              for (let i = 0; i < this.selectedDevices.length; i++) {
                let el = this.selectedDevices[i];
                this.addOrderDevice(response, el);
              }
            }
            if(this.filteredDevices || this.filteredDevices != null) {
              for (let i = 0; i < this.filteredDevices.length; i++) {
                let el = this.filteredDevices[i];
                let endpointDevice = `/api/order-device/${el.id}/`;
                apiService(endpointDevice, "PATCH", { datOrder: this.DatOrder, datDelivery: null, numOrderAmount: parseInt(el.numOrderAmount),
                idDevice: el.idDevice.id, idOrder: response.id })
              }
            }
            this.getOrder();
            this.emptyInput();
          }
        })
        .catch(err => console.log(err));
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
            this.getOrder();
            this.emptyItemInput();
            this.rowData1 = null;
          })
    },
    async updateDeviceOrder() {
      let endpoint = `/api/order-device/${this.updateDeviceId}/`;
      await apiService(endpoint, "PATCH", {
        datOrder: this.DatOrder,
        datDelivery: this.DatDelivery,
        numOrderAmount: this.OrderAmount,
        txtDeliveryStatus: this.DelStatus,
        txtComment: this.Comment, 
        idDevice: this.orderedDevice.id })
          .then(response => {
            this.getOrder();
            this.emptyDeviceInput();
            this.rowData2 = null;
          })
    },
    async updateItemAttribute() {
      let endpoint = `/api/order-item-attribute/${this.updateAttributeId}/`;
      await apiService(endpoint, "PATCH", { txtParameter: this.setParameter(), txtKeyAttribute: this.KeyAtt,
        txtNameAttribute: this.NameAtt, txtValueAttribute: this.ValueAtt, txtValueType: this.ValueType, })
        .then(response => {
          if (response != 'ERROR'){
            this.getOrder();
            this.emptyAttributeInput();
            this.rowData = null;
            this.rowData1 = null;
            this.rowData3 = null;
            this.error = false;
          } else {
            this.error = true;
          }
        })
        .catch(err => console.log(err));
    },
    openModal(params) {
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to delete the selected Order? => " + params.node.data.txtOrderNumber, {
          title: "Please Confirm", size: "m", buttonSize: "sm", okVariant: "danger", okTitle: "YES",
          cancelTitle: "NO", footerClass: "p-2", hideHeaderClose: false, centered: true })
        .then(value => { if (value) { this.deleteOrder(params); }})
        .catch(err => console.log(err));
    },
    openModal1(params) {
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to delete the selected Item Order?", {
          title: "Please Confirm", size: "m", buttonSize: "sm", okVariant: "danger", okTitle: "YES",
          cancelTitle: "NO", footerClass: "p-2", hideHeaderClose: false, centered: true })
        .then(value => { if (value) { this.deleteItemOrder(params); }})
        .catch(err => console.log(err));
    },
    openModal2(params) {
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to delete the selected Device Order?", {
          title: "Please Confirm", size: "m", buttonSize: "sm", okVariant: "danger", okTitle: "YES",
          cancelTitle: "NO", footerClass: "p-2", hideHeaderClose: false, centered: true })
        .then(value => { if (value) { this.deleteDeviceOrder(params); }})
        .catch(err => console.log(err));
    },
    openModal3(params) {
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to delete the selected Item Order Attribute?", {
          title: "Please Confirm", size: "m", buttonSize: "sm", okVariant: "danger",
          okTitle: "YES", cancelTitle: "NO", footerClass: "p-2", hideHeaderClose: false, centered: true })
        .then(value => { if (value) { this.deleteItemOrderAttribute(params); } })
        .catch(err => console.log(err));
    },
    async deleteOrder(params) {
      let endpoint = `/api/order/${params.node.data.id}/`;
      await apiService(endpoint, "DELETE")
        .then(response => {
          if (response != 'ERROR') {
            this.getOrder();
          } else {
            this.$bvToast.toast(`Can't delete this entry. Please check if there are dependent entries. Please delete those first!`, {
              title: 'DELETE WARNING', variant: 'danger', autoHideDelay: 6000, appendToast: false })
          }
        })
    },
    async deleteItemOrder(params) {
      let endpoint = `/api/order-item/${params.node.data.id}/`;
      await apiService(endpoint, "DELETE")
        .then(response => {
          if (response != 'ERROR') {
            this.getOrder();
            this.rowData1 = null;
          } else {
            this.$bvToast.toast(`Can't delete this entry. Please check if there are dependent entries. Please delete those first!`, {
              title: 'DELETE WARNING', variant: 'danger', autoHideDelay: 6000, appendToast: false })
          }
        })
    },
    async deleteDeviceOrder(params) {
      let endpoint = `/api/order-device/${params.node.data.id}/`;
      await apiService(endpoint, "DELETE")
        .then(response => {
          if (response != 'ERROR') {
            this.getOrder();
            this.rowData2 = null;
          } else {
            this.$bvToast.toast(`Can't delete this entry. Please check if there are dependent entries. Please delete those first!`, {
              title: 'DELETE WARNING', variant: 'danger', autoHideDelay: 6000, appendToast: false })
          }
        })
    },
    async deleteItemOrderAttribute(params) {
      let endpoint = `/api/order-item-attribute/${params.node.data.id}/`;
      await apiService(endpoint, "DELETE")
        .then(response => {
          if (response != 'ERROR') {
            this.getOrder();
            this.getOrderItem();
            this.rowData3 = null;
          } else {
            this.$bvToast.toast(`You can't delete this instance. Please check if all connections to this instance are deleted.`, {
              title: 'DELETE WARNING', variant: 'danger', autoHideDelay: 6000, appendToast: false
            })
          }
        })
    },
    emptyInput(event) {
      this.DelStatus = 'Not Delivered';
      this.ONumber = this.DatOrder = this.DatDelivery = this.OType = this.CNumber = this.Supplier = this.Comment = this.selectedItems = this.selectedDevices = null;
      if(event != 'add') {
        this.show = false;
      } else {
        this.updateStatus = false;
        this.show = !this.show;
      }
    },
    emptyItemInput(event) {
      this.DatOrder = this.DatDelivery = this.OrderAmount = this.DelStatus = this.Comment = null;
      this.SupplierReference = false;
      this.orderedItem = [];
      this.show1 = !this.show1;
      this.updateItemStatus = false;
    },
    emptyDeviceInput(event) {
      this.DatOrder = this.DatDelivery = this.OrderAmount = this.DelStatus = this.Comment = null;
      this.orderedDevice = [];
      this.show2 = !this.show2;
      this.updateDeviceStatus = false;
    },
    emptyAttributeInput(event) {
      this.KeyAtt = this.NameAtt = this.ValueAtt = this.ValueType = this.Parameter = null;
      this.ParameterTags = [];
      this.show3 = !this.show3;
      this.updateAttributeStatus = false;
    },
    emptyLastValueType(event) {
      this.ValueDef = this.Parameter = null;
      this.ParameterTags = [];
    },
    getOrder() {
      if (!this.error) {
        this.orders = [];
        let endpoint = `/api/order-list/`;
        apiService(endpoint)
          .then(data => {
            this.orders.push(...data.results);
            this.rowData = this.orders
          })
          .catch(err => console.log(err));
      }
    },
    getSup() {
      if (!this.error) {
        this.suppliers = [];
        let endpoint = `/api/supplier/`;
        apiService(endpoint)
          .then(data => {
            this.suppliers.push(...data.results);
            this.optionSupplier = this.suppliers
          })
          .catch(err => console.log(err));
      }
    },
    getItem() {
      if (!this.error) {
        this.items = [];
        let endpoint = `/api/item/`;
        apiService(endpoint)
          .then(data => {
            this.items.push(...data.results);
            this.optionItems = this.items
          })
          .catch(err => console.log(err));
      }
    },
    getItemAttributes(ItemId) {
      if (!this.error) {
        console.log('getItemAttributes')
        this.itemAttributes = [];
        let endpoint = `/api/item-attribute/`;
        apiService(endpoint)
          .then(data => {
            this.itemAttributes.push(...data.results);
            this.filteredItemAttributes = this.itemAttributes.filter(e => e.idItem == ItemId)
          })
          .catch(err => console.log(err));
      }
    },
    getOrderItemAttributes(OrderItemId) {
      if (!this.error) {
        this.orderItemAttributes = [];
        let endpoint = `/api/order-item-attribute/`;
        apiService(endpoint)
          .then(data => {
            this.orderItemAttributes.push(...data.results);
            this.rowData3 = this.orderItemAttributes.filter(e => e.idOrderItem == OrderItemId)
          })
          .catch(err => console.log(err));
      }
    },
    getOrderItem(val) {
      if (!this.error) {
        this.orderItems = [];
        let endpoint = `/api/order-item-list/`;
        apiService(endpoint)
          .then(data => {
            this.orderItems.push(...data.results);
            if(this.updateId != null) {
              this.filteredItems = this.orderItems.filter(e => e.idOrder.id == this.updateId)
            }
            if(val != null) {
              this.rowData1 = this.orderItems.filter(e => e.idOrder.id == val)
            }
          })
          .catch(err => console.log(err));
      }
    },
    getDevice() {
      if (!this.error) {
        this.devices = [];
        let endpoint = `/api/device-list/`;
        apiService(endpoint)
          .then(data => {
            this.devices.push(...data.results);
            this.optionDevices = this.devices
          })
          .catch(err => console.log(err));
      }
    },
    getOrderDevice(val) {
      if (!this.error) {
        this.orderDevices = [];
        let endpoint = `/api/order-device-list/`;
        apiService(endpoint)
          .then(data => {
            this.orderDevices.push(...data.results);
            if(this.updateId != null) {
              this.filteredDevices = this.orderDevices.filter(e => e.idOrder.id == this.updateId)
            }
            if(val != null) {
              this.rowData2 = this.orderDevices.filter(e => e.idOrder.id == val)
            }
          })
          .catch(err => console.log(err));
      }
    },
    getContextMenu(params) {
      var result = [
        {
          name: 'Edit Order',
          action: () => this.editOrderMenu(params)
        },
        'separator',
        {
          name: 'Delete Order',
          action: () =>  this.openModal(params)
        },
        'export'
      ];
      return result;
    },
    getContextMenu1(params) {
      var result = [
        {
          name: 'Edit Order Item',
          action: () => this.editOrderItemMenu(params)
        },
        'separator',
        {
          name: 'Delete Order Item',
          action: () =>  this.openModal1(params)
        },
        'export'
      ];
      return result;
    },
    getContextMenu2(params) {
      var result = [
        {
          name: 'Edit Order Device',
          action: () => this.editOrderDeviceMenu(params)
        },
        'separator',
        {
          name: 'Delete Order Device',
          action: () =>  this.openModal2(params)
        },
        'export'
      ];
      return result;
    },
    getContextMenu3(params) {
      var result = [
        {
          name: 'Edit Attribute',
          action: () => this.editAttributeMenu(params)
        },
        'separator',
        {
          name: 'Delete Item Order Attribute',
          action: () =>  this.openModal3(params)
        },
        'separator',
        'export'
      ];
      return result;
    },
    getDateToday() {
      var today = new Date();
      this.date = today.getDate()+' / '+(today.getMonth()+1)+' / '+today.getFullYear();
      this.DelStatus = 'Not Delivered'
    },
    getSelectedOrder(event) {
      if(window.localStorage.getItem('selOrder') != null) {
        let el = parseInt(localStorage.getItem('selOrder'));
        event.api.forEachNode(rowNode => { rowNode.setSelected(rowNode.data.id === el) });
      }
    },
  },
  created() {
    this.getSup();
    this.getOrder();
    this.getDateToday();
    this.getOrderDevice();
    this.getOrderItem();
    this.getDevice();
    this.getItem();
  },
  beforeRouteLeave (to, from, next) {
    window.localStorage.removeItem('selOrder');
    next()
  }
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
  #new-order-section {
    cursor: pointer;
    outline: none;
  }
  .input-group-append, .input-group-prepend, .dropdown-toggle {
    width: auto!important;
  }
  .input-group-text {
    font-weight: 700!important;
  }
</style>
