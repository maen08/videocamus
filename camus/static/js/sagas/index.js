import {apply, put, takeEvery, takeLatest, getContext} from 'redux-saga/effects';
import {setUsername} from '../slices/users';
import {sendChatMessage} from '../slices/messages';
import {setLocalAudio, setLocalVideo} from '../slices/feeds';

export default function* rootSaga() {
    yield takeLatest(setUsername.type, doSetUsername);
    yield takeEvery(sendChatMessage.type, doSendChatMessage);
    yield takeLatest(setLocalAudio.type, doSetLocalAudio);
    yield takeLatest(setLocalVideo.type, doSetLocalVideo);
}

function* doSetUsername(action) {
    const manager = yield getContext('manager');
    const username = action.payload;

    try {
        yield apply(manager, manager.setUsername, [username]);
        yield put({type: 'MANAGER_UPDATED'});
    } catch (err) {
        yield put({type: 'MANAGER_ERROR', payload: err});
    }
}

function* doSendChatMessage(action) {
    const manager = yield getContext('manager');
    const message = action.payload;

    try {
        const time = new Date().getTime();
        const data = {
            receiver: 'room',
            type: 'text',
            data: {
                from: manager.username,
                time: time,
                text: message
            }
        };

        yield apply(manager.signaler, manager.signaler.send, [data]);
        yield put({type: 'MANAGER_UPDATED'});
    } catch (err) {
        yield put({type: 'MANAGER_ERROR', payload: err});
    }
}

function* doSetLocalAudio(action) {
    const manager = yield getContext('manager');
    const track = action.payload;

    try {
        if (track) {
            yield apply(manager, manager.setAudioTrack, [track]);
        } else {
            yield apply(manager, manager.stopAudio);
        }

        yield put({type: 'MANAGER_UPDATED'});
    } catch(err) {
        yield put({type: 'MANAGER_ERROR', payload: err});
    }
}

function* doSetLocalVideo(action) {
    const manager = yield getContext('manager');
    const track = action.payload;

    try {
        if (track) {
            yield apply(manager, manager.setVideoTrack, [track]);
        } else {
            yield apply(manager, manager.stopVideo);
        }

        yield put({type: 'MANAGER_UPDATED'});
    } catch(err) {
        yield put({type: 'MANAGER_ERROR', payload: err});
    }
}
