const BASE_URL = "http://localhost:5000";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return token
        ? {
              Authorization: `Bearer ${token}`
          }
        : {};
};

const handleResponse = (response) => {
    if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }

    return response;
};

export const getTasks = () => {
    return fetch(`${BASE_URL}/tasks`, {
        headers: getAuthHeaders()
    }).then(handleResponse);
};

export const createTask = (task) => {
    return fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify(task)
    }).then(handleResponse);
};

export const updateTask = (id, task) => {
    return fetch(`${BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify(task)
    }).then(handleResponse);
};

export const deleteTask = (id) => {
    return fetch(`${BASE_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    }).then(handleResponse);
};