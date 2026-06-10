import { HttpGet, HttpPost, HttpPostImage, HttpPut, HttpDelete } from "./Http"

export const getIssues = async () => {
    try {
        const data = await HttpGet('open_issues')
        return data
    } catch (error) {
        return error
    }
}

export const deleteIssues = async (issueId) => {
    try {
        const data = await HttpDelete(`open_issues/${issueId}`)
        return data
    } catch (error) {
        return error
    }
}

export const saveIssue = async (payload) => {
    try {
        const data = await HttpPost(`open_issues`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}