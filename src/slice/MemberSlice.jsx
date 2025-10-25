import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchMembersApi,
  addMemberApi,
  updateMemberApi,
  deleteMemberApi,
  toggleGoldApi,
  updateWalletApi,
} from "../services/MemberService";


/* ---- thunks ---- */
export const fetchMembers = createAsyncThunk(
  "member/fetchMembers",
  async (searchText = "") => await fetchMembersApi(searchText)
);

export const addMember = createAsyncThunk(
  "member/addMember",
  async (memberData) => {
    const res = await addMemberApi(memberData);
    if (res.head.code !== 200) throw new Error(res.head.msg);
    return res.head.msg;
  }
);

export const updateMember = createAsyncThunk(
  "member/updateMember",
  async (memberData) => {
    const res = await updateMemberApi(memberData);
    if (res.head.code !== 200) throw new Error(res.head.msg);
    return res.head.msg;
  }
);

export const deleteMember = createAsyncThunk(
  "member/deleteMember",
  async (memberId) => {
    const res = await deleteMemberApi(memberId);
    if (res.head.code !== 200) throw new Error(res.head.msg);
    return res.head.msg;
  }
);

export const toggleGold = createAsyncThunk(
  "member/toggleGold",
  async ({ member_id, makeGold }) => {
    const res = await toggleGoldApi(member_id, makeGold);
    if (res.head.code !== 200) throw new Error(res.head.msg);
    return { member_id, makeGold };
  }
);
export const updateWallet = createAsyncThunk(
  "member/updateWallet",
  async (walletData) => {
    const res = await updateWalletApi(walletData);
    if (res.head.code !== 200) throw new Error(res.head.msg);
    return res.head.msg;
  }
);

/* ---- slice ---- */
const memberSlice = createSlice({
  name: "member",
  initialState: {
    member: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetch
    builder
      .addCase(fetchMembers.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchMembers.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.member = a.payload.member || [];
      })
      .addCase(fetchMembers.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.error.message;
      });

    // add / update / delete – just change UI status
    const common = (builder) =>
      builder
        .addCase(addMember.pending, (s) => {
          s.status = "loading";
        })
        .addCase(addMember.fulfilled, (s) => {
          s.status = "succeeded";
        })
        .addCase(addMember.rejected, (s, a) => {
          s.status = "failed";
          s.error = a.error.message;
        })
        .addCase(updateMember.pending, (s) => {
          s.status = "loading";
        })
        .addCase(updateMember.fulfilled, (s) => {
          s.status = "succeeded";
        })
        .addCase(updateMember.rejected, (s, a) => {
          s.status = "failed";
          s.error = a.error.message;
        })
        .addCase(deleteMember.pending, (s) => {
          s.status = "loading";
        })
        .addCase(deleteMember.fulfilled, (s) => {
          s.status = "succeeded";
        })
        .addCase(deleteMember.rejected, (s, a) => {
          s.status = "failed";
          s.error = a.error.message;
        });

    common(builder);

    // toggle gold – optimistically update the array, add expired logic if needed
    builder.addCase(toggleGold.fulfilled, (state, action) => {
      const { member_id, makeGold } = action.payload;
      const goldVal = makeGold ? "Yes" : "No";
      const idx = state.member.findIndex((m) => m.member_id === member_id);
      if (idx !== -1) {
        state.member[idx].membership = goldVal;
      }
    });
    builder
  .addCase(updateWallet.pending, (s) => {
    s.status = "loading";
  })
  .addCase(updateWallet.fulfilled, (s) => {
    s.status = "succeeded";
  })
  .addCase(updateWallet.rejected, (s, a) => {
    s.status = "failed";
    s.error = a.error.message;
  });

  },
});

export default memberSlice.reducer;
