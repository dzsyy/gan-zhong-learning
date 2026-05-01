package com.ganzhong.controller;

import com.ganzhong.model.entity.ArchiveRecord;
import com.ganzhong.service.ArchiveRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/archive")
@RequiredArgsConstructor
public class ArchiveController {

    private final ArchiveRecordService archiveRecordService;

    @GetMapping
    public List<ArchiveRecord> getAll() {
        return archiveRecordService.findAll();
    }

    @PostMapping
    public ArchiveRecord create(@RequestBody ArchiveRecord record) {
        return archiveRecordService.create(
            record.getProjectName(),
            record.getTotalPowders(),
            record.getCompletedPowders(),
            record.getStatus()
        );
    }

    @PutMapping("/{id}")
    public ArchiveRecord update(@PathVariable Long id, @RequestBody ArchiveRecord record) {
        return archiveRecordService.update(id, record);
    }
}
