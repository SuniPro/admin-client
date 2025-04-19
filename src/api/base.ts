import axios, { AxiosResponse } from "axios";

export class HttpError extends Error {
  public status: number;
  // eslint-disable-next-line
  public response: any;
  public url: string;

  // eslint-disable-next-line
  constructor(status: number, message: string, response: any, url: string) {
    super(message);
    this.status = status;
    this.response = response;
    this.url = url;
  }

  toString() {
    return `HttpError: ${this.status} - ${this.message} (URL: ${this.url})`;
  }
}

interface InitOptions {
  skipError?: boolean;
  allowStatus?: number[];
}

export async function getFromEmployeeServer(
  url: string,
  init: InitOptions = { skipError: false },
): Promise<AxiosResponse> {
  const token = localStorage.getItem("access-token");
  const server = import.meta.env.VITE_EMPLOYEE_SERVER_PREFIX;
  const serverUrl = server + url;
  return axios
    .get(serverUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => responseHandler(response, serverUrl, init))
    .catch(errorHandler);
}

export async function postToEmployeeServer(
  url: string,
  // eslint-disable-next-line
  param: any,
  init: RequestInit & { skipError?: boolean } = {},
): Promise<AxiosResponse> {
  const token = localStorage.getItem("access-token");
  const server = import.meta.env.VITE_EMPLOYEE_SERVER_PREFIX;
  const serverUrl = server + url;
  return axios
    .post(serverUrl, param, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .catch(errorHandler)
    .then((response) => responseHandler(response, serverUrl, init));
}

export async function putToEmployeeServer(
  url: string,
  // eslint-disable-next-line
  param: any,
  init: RequestInit & { skipError?: boolean } = {},
): Promise<AxiosResponse> {
  const token = localStorage.getItem("access-token");
  const server = import.meta.env.VITE_EMPLOYEE_SERVER_PREFIX;
  const serverUrl = server + url;
  return axios
    .put(serverUrl, param, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .catch(errorHandler)
    .then((response) => responseHandler(response, serverUrl, init));
}

export async function patchToEmployeeServer(
  url: string,
  // eslint-disable-next-line
  param: any,
  init: RequestInit & { skipError?: boolean } = {},
): Promise<AxiosResponse> {
  const token = localStorage.getItem("access-token");
  const server = import.meta.env.VITE_EMPLOYEE_SERVER_PREFIX;
  const serverUrl = server + url;
  return axios
    .patch(serverUrl, param, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .catch(errorHandler)
    .then((response) => responseHandler(response, serverUrl, init));
}

export async function updateToEmployeeServer(
  url: string,
  // eslint-disable-next-line
  param: any,
  init: RequestInit & {
    skipError?: boolean;
  } = {},
): Promise<AxiosResponse> {
  const token = localStorage.getItem("access-token");
  const server = import.meta.env.VITE_EMPLOYEE_SERVER_PREFIX;
  const serverUrl = server + url;
  return axios
    .put(serverUrl, param, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .catch(errorHandler)
    .then((response) => responseHandler(response, serverUrl, init));
}

export async function deleteToEmployeeServer(
  url: string,
  init: InitOptions = { skipError: false },
): Promise<AxiosResponse> {
  const token = localStorage.getItem("access-token");
  const server = import.meta.env.VITE_EMPLOYEE_SERVER_PREFIX;
  const serverUrl = server + url;
  return axios
    .delete(serverUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => responseHandler(response, serverUrl, init))
    .catch(errorHandler);
}

export async function postToTravelServerMultiPleFile(
  url: string,
  id: string,
  type: string,
  param: Blob,
  init: RequestInit & { skipError?: boolean } = {},
): Promise<AxiosResponse> {
  // @ts-ignore
  const server = import.meta.env.VITE_TRAVEL_SERVER_PREFIX;
  const serverUrl = server + url;
  let formData = new FormData();

  formData.append("id", id);
  formData.append("file", param);
  formData.append("type", type);

  return axios
    .post(serverUrl, formData, {
      headers: { "content-type": "multipart/form-data" },
      withCredentials: true,
    })
    .catch(errorHandler)
    .then((response) => responseHandler(response, serverUrl, init));
}

async function responseHandler(
  response: AxiosResponse,
  url: string,
  init: InitOptions = { skipError: false, allowStatus: [200, 201, 204] },
): Promise<AxiosResponse> {
  if (response.status !== 200 && !init.skipError) {
    const text = JSON.stringify(response.data);
    // eslint-disable-next-line
    let jsonResponse: any;

    try {
      jsonResponse = JSON.parse(text);
    } catch {
      throw new HttpError(response.status, text, text, url);
    }

    let message = "An error occurred";
    if (jsonResponse?.errors) {
      message = jsonResponse.errors
        .map((error: { detail: string }) => error.detail)
        .join("\n");
    } else if (jsonResponse?.message) {
      message = jsonResponse.message;
    }

    throw new HttpError(response.status, message, jsonResponse, url);
  }

  return response;
}

// eslint-disable-next-line
function errorHandler(error: any): never {
  if (axios.isAxiosError(error) && error.response) {
    const { status, data, config } = error.response;
    const message = data?.message || "An unexpected error occurred.";

    throw new HttpError(status, message, data, config.url || "Unknown URL");
  } else {
    throw new HttpError(
      0,
      "Network error or server is unreachable",
      null,
      "Unknown URL",
    );
  }
}
