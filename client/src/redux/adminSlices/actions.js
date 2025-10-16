export const addVehicleClicked = (clicked) => ({
  type: "Add_vehicle_clicked",
  payload: clicked,
});

export const setEditData = (data)=> ({
  type:"Set_edit_data",
  payload:data
})

export const uploadImageStart = ()=> ({
  type:'upload_image_start',
})

export const uploadImageSuccess = (data)=> ({
  type:'upload_image_success',
  payload:data
})

export const uploadImageFailure= (data)=> ({
  type:'upload_image_fail',
  payload:data
})



