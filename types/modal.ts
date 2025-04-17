export interface AlertModalData {
    title: string;
    contents: string;
}

export interface ConfirmModalData extends AlertModalData {
    confirmButtonText: string;
}
