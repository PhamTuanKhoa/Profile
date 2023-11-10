   let classroomID = null;
   
   function save() {
        let room = document.getElementById('room').value;
        let auditorium = document.getElementById('auditorium').value;
        let seats = document.getElementById('seats').value;
        let projector = '';
        let status = '';

        // Check which radio button is selected for projector
        if (document.getElementById('available-projector').checked) {
            projector = document.getElementById('available-projector').value;
        } else if (document.getElementById('unavailable-projector').checked) {
            projector = document.getElementById('unavailable-projector').value;
        }

        // Check which radio button is selected for status
        if (document.getElementById('available-room').checked) {
            status = document.getElementById('available-room').value;
        } else if (document.getElementById('unavailable-room').checked) {
            status = document.getElementById('unavailable-room').value;
        } else if (document.getElementById('waiting-room').checked) {
            status = document.getElementById('waiting-room').value;
        }

        if (room && auditorium && seats && projector && status) {
            let classroom = {
                room: room,
                auditorium: auditorium,
                seats: seats,
                projector: projector,
                status: status,
            };

            let classrooms = localStorage.getItem('classrooms') ? JSON.parse(localStorage.getItem('classrooms')) : [];
            
            if (classroomID !== null) {
                // Update the existing row
                classrooms[classroomID] = classroom;

                document.getElementById('room').value = '';
                document.getElementById('auditorium').value = '';
                document.getElementById('seats').value = '';
                document.getElementById('available-projector').checked = false;
                document.getElementById('unavailable-projector').checked = false;
                document.getElementById('available-room').checked = false;
                document.getElementById('unavailable-room').checked = false;
                document.getElementById('waiting-room').checked = false;

                classroomID = null;
            } else {
                // Add a new row
                classrooms.push(classroom);
            } 

            localStorage.setItem('classrooms', JSON.stringify(classrooms));

            this.renderListClassrooms();
        }
    }

    // function renderListClassrooms() {
    //     let classrooms = localStorage.getItem('classrooms') ? JSON.parse(localStorage.getItem('classrooms')) : [];

    //     if(classrooms.length === 0) {
    //         document.getElementById('classroom-list').style.display = "none";  
    //         return  false;
    //     }

    //     document.getElementById('classroom-list').style.display = "block";

    //     let tableContent = `<tr>
    //             <td>STT</td>
    //             <td>Phòng</td>
    //             <td>Giảng đường</td>
    //             <td>Số chỗ ngồi</td>
    //             <td>Máy chiếu</td>
    //             <td>Tình trạng</td>
    //             <td>Thao tác</td>
    //         </tr>`;
        
    //     classrooms.forEach((classroom, index) => {
    //         let classroomID = index;
    //         index++;
    //         tableContent += `<tr>
    //             <td>${index}</td>
    //             <td>${classroom.room}</td>
    //             <td>${classroom.auditorium}</td>
    //             <td>${classroom.seats}</td>
    //             <td>${classroom.projector}</td>
    //             <td>${classroom.status}</td>
    //             <td>
    //                  <button id="edit-button" onclick='editClassroom(${classroomID})' type="button">Edit</button> | <button id="delete-button" onclick='deleteClassroom(${classroomID})' type="button">Delete</button>
    //             </td>
    //         </tr>`;
    //      })

    //     document.getElementById('grid-classrooms').innerHTML = tableContent;
    // }

    function renderListClassrooms(classrooms = null) {
        let classroomsToRender = classrooms || JSON.parse(localStorage.getItem('classrooms')) || [];

        if (classroomsToRender.length === 0) {
            document.getElementById('classroom-list').style.display = "none";
            return false;
        }

        document.getElementById('classroom-list').style.display = "block";

        let tableContent = `<tr>
            <td>STT</td>
            <td>Phòng</td>
            <td>Giảng đường</td>
            <td>Số chỗ ngồi</td>
            <td>Máy chiếu</td>
            <td>Tình trạng</td>
            <td>Thao tác</td>
        </tr>`;

        classroomsToRender.forEach((classroom, index) => {
            let classroomID = index;
            index++;
            tableContent += `<tr>
                <td>${index}</td>
                <td>${classroom.room}</td>
                <td>${classroom.auditorium}</td>
                <td>${classroom.seats}</td>
                <td>${classroom.projector}</td>
                <td>${classroom.status}</td>
                <td>
                    <button id="edit-button" onclick='editClassroom(${classroomID})' type="button">Edit</button> | 
                    <button id="delete-button" onclick='deleteClassroom(${classroomID})' type="button">Delete</button>
                </td>
            </tr>`;
        });

        document.getElementById('grid-classrooms').innerHTML = tableContent;
    }

    function deleteClassroom(classroomID) {
        let classrooms = localStorage.getItem('classrooms') ? JSON.parse(localStorage.getItem('classrooms')) : [];
        classrooms.splice(classroomID, 1);

        localStorage.setItem('classrooms', JSON.stringify(classrooms));
        renderListClassrooms();
    }

    function editClassroom(id) {
        let classrooms = localStorage.getItem('classrooms') ? JSON.parse(localStorage.getItem('classrooms')) : [];

        classroomID = id;
        
        // Populate the input fields with existing data
        document.getElementById('room').value = classrooms[classroomID].room;
        document.getElementById('auditorium').value = classrooms[classroomID].auditorium;
        document.getElementById('seats').value = classrooms[classroomID].seats;
    
        // Check the radio button for projector based on existing data
        if (classrooms[classroomID].projector === 'Có') {
            document.getElementById('available-projector').checked = true;
        } else {
            document.getElementById('unavailable-projector').checked = true;
        }
    
        // Check the radio button for status based on existing data
        switch (classrooms[classroomID].status) {
            case 'Rảnh':
                document.getElementById('available-room').checked = true;
                break;
            case 'Bận':
                document.getElementById('unavailable-room').checked = true;
                break;
            case 'Chờ xếp lịch':
                document.getElementById('waiting-room').checked = true;
                break;
        }
    
        // Store the classroomID to use it when saving the edited data
        document.getElementById('save-button').setAttribute('data-classroom-id', classroomID);
    }

    function search() {
        let searchInput = document.getElementById('search-bar').value.toLowerCase();
        let classrooms = JSON.parse(localStorage.getItem('classrooms')) || [];
        let filteredClassrooms = classrooms.filter(classroom => {
            return (
                classroom.room.toLowerCase().includes(searchInput) ||
                classroom.auditorium.toLowerCase().includes(searchInput) ||
                classroom.seats.toLowerCase().includes(searchInput) ||
                classroom.projector.toLowerCase().includes(searchInput) ||
                classroom.status.toLowerCase().includes(searchInput)
            );
        });

        renderListClassrooms(filteredClassrooms);
    }

