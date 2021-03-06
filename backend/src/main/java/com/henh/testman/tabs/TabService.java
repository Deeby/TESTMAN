package com.henh.testman.tabs;

import com.henh.testman.tabs.request.TabInsertReq;
import com.henh.testman.tabs.request.TabUpdateReq;

import java.util.List;
import java.util.Optional;

public interface TabService {

    Optional<Tab> insertTab(TabInsertReq tabInsertReq);

    Optional<Tab> selectTab(Long seq);

    List<TabDto> selectTabByWorkspaceSeq(Long WorkspaceSeq);

    List<TabDto> selectTabByCollectionSeq(Long collectionSeq);

    Optional<Tab> updateTabByCollectionSeq(TabUpdateReq updateReq);

    Optional<Long> deleteTab(Long seq);

    Optional<Tab> deleteCollectionSeq(Long seq);

}
